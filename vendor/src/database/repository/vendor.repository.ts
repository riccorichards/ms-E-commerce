import UserModel from "../models/vendor.model";
import { VendorDocument } from "../types/types.vendor";
import SessionModel from "../models/session.model";
import _, { omit } from "lodash";
import VendorModel from "../models/vendor.model";
import TeamModel from "../models/teamMember.model";
import {
  FeedbackMessageType,
  FeedbacksDocsType,
} from "../types/types.feedbacks";
import FeedsModel from "../models/feedback.model";
import {
  CreateVendorSchemaType,
  UpdateVendorSchemaType,
} from "../../api/middleware/validation/vendor.validation";
import ErrorHandler from "./repoErrorHandler";
import { CreateSessionSchemaType } from "../../api/middleware/validation/session.validation";
import { UpdateAddressSchemaType } from "../../api/middleware/validation/address.validation";
import {
  CreateTeamMemberSchemaType,
  UpdateTeamMemberSchemaType,
} from "../../api/middleware/validation/team.validation";
import {
  BioValidationType,
  workingDaysValidationType,
} from "../../api/middleware/validation/additional.validation";
import { AddSocialUrlType } from "../../api/middleware/validation/socialUrls.validation";
import { URL } from "node:url";
import FoodsModel from "../models/foods.model";
import { FoodMessageType } from "../types/type.foods";
import {
  GalleryMessageType,
  ImageMessageType,
  RemovePhotoMsg,
} from "../types/type.imageUrl";
import GalleryModel from "../models/gallery.model";
import { MessageOrderType, OrderDocument } from "../types/type.order";
import OrderModel from "../models/order.model";
import {
  getCustomerInfo,
  makeRequestWithRetries,
} from "../../utils/makeRequestWithRetries";

interface VendorTotal {
  vendor: string;
  totalAmount: number;
}

interface WeeklyTopVendors {
  [key: string]: VendorTotal[];
}

class VendorRepo {
  async CreateVendor(input: CreateVendorSchemaType) {
    try {
      const newVendor = await VendorModel.create({
        ...input,
        about: null,
        rating: 0,
        workingHrs: null,
        address: null,
        teamMember: null,
        feeds: [],
        gallery: [],
        socialMedia: [],
      });

      if (!newVendor) throw new Error("Error while creating a new vendor...");
      return newVendor;
    } catch (error) {
      ErrorHandler(error);
    }
  }

  async CreateSession(
    input: CreateSessionSchemaType["body"],
    userAgent: string
  ) {
    try {
      const vendor = await UserModel.findOne({ email: input.email });

      if (!vendor) {
        throw new Error("Wrong credentials");
      }

      const validPass = await vendor.comparePass(input.password);

      if (!validPass) {
        throw new Error("Wrong credentials");
      }

      const newSession = await SessionModel.create({
        vendor: vendor._id,
        userAgent,
      });

      if (!newSession) throw new Error("Error while creating a new session");

      return { vendor, newSession };
    } catch (error) {
      ErrorHandler(error);
    }
  }

  async TeamMembers(
    vendorId: string,
    input: CreateTeamMemberSchemaType["body"]
  ) {
    try {
      const vendor = (await VendorModel.findById(vendorId)) as VendorDocument;
      const newTeamMember = await TeamModel.create(input);
      if (!newTeamMember)
        throw new Error("Error while creating a new team member");

      const result = await newTeamMember.save();

      vendor.teamMember.push(omit(result.toJSON(), "vendorId")._id);

      await vendor.save();
      return newTeamMember;
    } catch (error) {
      ErrorHandler(error);
    }
  }

  async RemoveMember(vendorId: string, memberId: string) {
    try {
      const vendor = await VendorModel.findById(vendorId);
      if (!vendor) throw new Error("Error while finding the vendor");

      vendor.teamMember = vendor.teamMember.filter(
        (member) => member.toString() !== memberId.toString()
      );

      await vendor.save();
      const removedMember = await TeamModel.findByIdAndDelete(memberId);
      return removedMember;
    } catch (error) {
      ErrorHandler(error);
    }
  }

  async UpdateVendorProfile(
    query: string,
    input: CreateVendorSchemaType["body"]
  ) {
    try {
      return await VendorModel.findByIdAndUpdate(query, input, { new: true });
    } catch (error) {
      ErrorHandler(error);
    }
  }

  async UpdateTeamMember(
    query: string,
    input: UpdateTeamMemberSchemaType["body"]
  ) {
    try {
      const profile = await VendorModel.findById(query);
      const updatedTeamMember = await TeamModel.findByIdAndUpdate(
        profile?.teamMember,
        input,
        { new: true }
      );
      if (!updatedTeamMember)
        throw new Error("Error while updating the vendor's team member");
      return updatedTeamMember;
    } catch (error) {
      ErrorHandler(error);
    }
  }

  async AddBioToVendor(vendorId: string, input: BioValidationType["body"]) {
    try {
      const vendor = await VendorModel.findById(vendorId);
      if (!vendor) throw new Error("Vendor not found");

      vendor.about = input.bio;

      await vendor.save();
      return input.bio;
    } catch (error) {
      ErrorHandler(error);
    }
  }

  async AddWorkingHrs(
    vendorId: string,
    input: workingDaysValidationType["body"]
  ) {
    try {
      const vendor = await VendorModel.findById(vendorId);
      if (!vendor) throw new Error("Vendor Not Found");
      vendor.workingHrs = input;
      await vendor.save();
      return input;
    } catch (error) {
      ErrorHandler(error);
    }
  }

  async UploadImage(input: ImageMessageType) {
    try {
      const vendor = await VendorModel.findById(input.userId);
      if (!vendor) throw new Error("Vendor Not Found");
      vendor.image = input.url;
      return await vendor.save();
    } catch (error) {
      ErrorHandler(error);
    }
  }

  async UploadGallery(input: GalleryMessageType) {
    try {
      const vendor = await VendorModel.findById(input.userId);
      if (!vendor) throw new Error("Vendor Not Found");
      const { url, title } = input.photo;
      const addNewGallertPhoto = await GalleryModel.create({ url, title });
      vendor.gallery.push(addNewGallertPhoto._id);

      return await vendor.save();
    } catch (error) {
      ErrorHandler(error);
    }
  }

  async UpdateBioInVendor(vendorId: string, input: BioValidationType["body"]) {
    try {
      const vendor = await VendorModel.findById(vendorId);

      if (!vendor) throw new Error("Vendor not found");
      vendor.about = input.bio;
      return omit((await vendor.save()).toJSON(), "password");
    } catch (error) {
      ErrorHandler(error);
    }
  }

  async GetAdditionalInfo(vendorId: string) {
    try {
      const vendor = await VendorModel.findById(vendorId);

      if (!vendor) throw new Error("Vendor not found");

      return { about: vendor.about, workingHrs: vendor.workingHrs };
    } catch (error) {
      ErrorHandler(error);
    }
  }

  async AddSocialUrl(vendorId: string, input: AddSocialUrlType["body"]) {
    try {
      const vendor = await VendorModel.findById(vendorId);

      if (!vendor) throw new Error("Vendor not found");

      let domain = new URL(input.url).hostname;

      if (domain.split(".").length > 2) {
        domain = domain.split(".")[1];
      } else if (domain.split(".").length <= 2) {
        domain = domain.split(".")[0];
      }

      const readyForStore = {
        title: domain,
        url: input.url,
      };

      vendor.socialMedia.push(readyForStore);

      await vendor.save();
      return readyForStore;
    } catch (error) {
      ErrorHandler(error);
    }
  }

  async RemoveSocialUrl(vendorId: string, title: string) {
    try {
      const vendor = await VendorModel.findById(vendorId);

      if (!vendor) throw new Error("Vendor not found");

      vendor.socialMedia = vendor.socialMedia.filter(
        (url) => url.title !== title
      );

      await vendor.save();
      return vendor.socialMedia;
    } catch (error) {
      ErrorHandler(error);
    }
  }

  async FindVendor(id: string) {
    try {
      const result = await VendorModel.findById(id)
        .populate({
          path: "teamMember",
          options: { sort: { createdAt: -1 } },
        })
        .populate({
          path: "feeds",
          options: { sort: { createdAt: -1 } },
        })
        .populate({
          path: "foods",
          options: { sort: { createdAt: -1 } },
        })
        .populate({
          path: "gallery",
          options: { sort: { createdAt: -1 } },
        });

      if (!result) throw new Error("Vendor was not found");

      return result;
    } catch (error) {
      ErrorHandler(error);
    }
  }

  async GetVendorOrders(id: string, withCustomerInfo: boolean) {
    try {
      const vendor = await VendorModel.findById(id).populate({
        path: "orders",
        select:
          "order_status total_amount deliverymanName customerId orderId createdAt",
      });

      if (!vendor) throw new Error("Error while getting vendor's orders");

      const ordersPromises = (vendor.orders as OrderDocument[]).map(
        async (order) => {
          let customerInfo;
          if (withCustomerInfo) {
            try {
              customerInfo = await getCustomerInfo(order.customerId);
              if (!customerInfo) throw new Error("Customer not found");
            } catch (error) {
              console.error(
                `Failed to get customer info for customerId: ${order.customerId}`,
                error
              );
              customerInfo = { error: "Customer info unavailable" };
            }
          }

          return {
            order_status: order.order_status,
            total_amount: order.total_amount,
            deliverymanName: order.deliverymanName,
            customer: customerInfo || order.customerId,
            orderId: order.orderId,
            createdAt: order.createdAt,
          };
        }
      );

      const orders = await Promise.all(ordersPromises);

      const maxItems = withCustomerInfo ? 10 : orders.length - 1;
      return orders
        .filter((order) => order)
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
        .slice(0, maxItems);
    } catch (error) {
      ErrorHandler(error);
    }
  }

  async GetTopCustomers(id: string) {
    try {
      const vendor = await VendorModel.findById(id).populate({
        path: "orders",
        select: "total_amount customerId",
      });

      if (!vendor) {
        throw new Error("Vendor not found");
      }

      if (!vendor.orders || vendor.orders.length === 0) {
        throw new Error("No orders for this vendor");
      }

      const groupedByCustomerId = _.groupBy(vendor.orders, "customerId");
      const topCustomers = _.map(
        groupedByCustomerId,
        async (orders, customerId) => {
          const totalAmount = _.sumBy(orders, "total_amount");
          try {
            const customer = await getCustomerInfo(customerId);
            return {
              customer: customer,
              total_amount: totalAmount.toFixed(2),
            };
          } catch (error) {
            console.error(
              `Failed to get customer info for customerId: ${customerId}`,
              error
            );
          }
        }
      );

      return await Promise.all(topCustomers);
    } catch (error) {
      ErrorHandler(error);
    }
  }

  async GetVendorOrderItems(id: string, orderId: number) {
    try {
      const vendor = await VendorModel.findById(id).populate("orders");

      if (!vendor) throw new Error("Error while getting vendor's orders");

      const order = (vendor.orders as OrderDocument[]).find(
        (order) => order.orderId === orderId
      );
      if (!order) throw new Error("Error while finding order");

      return order.orderItem;
    } catch (error) {
      ErrorHandler(error);
    }
  }

  async GetAllVendor() {
    try {
      const result = await VendorModel.find({}).populate("address").lean();
      return result.map((vendor) => {
        return {
          name: vendor.name,
          _id: vendor._id,
          address: vendor.address,
          email: vendor.email,
          phone: vendor.phone,
          image: vendor.image,
          workingHrs: vendor.workingHrs,
          rating: vendor.rating,
          socialUrls: vendor.socialMedia,
        };
      });
    } catch (error) {
      ErrorHandler(error);
    }
  }

  async GetVendorsFeeds(vendorId: string, page: number) {
    try {
      const limit = 6;
      const skip = (page - 1) * limit;
      const totalFeeds = await FeedsModel.count({ forVendorId: vendorId });

      const feedbacks = await FeedsModel.find({ forVendorId: vendorId })
        .sort({ feedId: -1 })
        .skip(skip)
        .limit(limit);

      const totalPages = Math.ceil(totalFeeds / limit);
      const pagination = {
        page: page,
        totalPages,
        pageSize: limit,
        totalCount: totalFeeds,
      };
      return {
        vendorFeeds: feedbacks.sort((a, b) => b.feedId - a.feedId),
        pagination,
      };
    } catch (error) {
      ErrorHandler(error);
    }
  }

  async GetTopVendors() {
    try {
      const vendors = await VendorModel.find({})
        .populate({ path: "orders", select: "total_amount createdAt" })
        .lean();

      const weekDays = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ];

      let weeklyTopVendors: WeeklyTopVendors = {};

      weekDays.forEach((day) => (weeklyTopVendors[day] = []));

      vendors.forEach((vendor) => {
        const groupedByDay = _.groupBy(
          vendor.orders,
          (order: OrderDocument) => {
            return weekDays[new Date(order.createdAt).getDay()];
          }
        );

        weekDays.forEach((day) => {
          const totalAmount = (
            (groupedByDay[day] as OrderDocument[]) || []
          ).reduce((acc, order) => acc + order.total_amount, 0);

          weeklyTopVendors[day].push({
            vendor: vendor.name,
            totalAmount,
          });
        });
      });

      Object.keys(weeklyTopVendors).forEach((day) => {
        weeklyTopVendors[day].sort((a, b) => b.totalAmount - a.totalAmount);
        weeklyTopVendors[day] = weeklyTopVendors[day].slice(0, 5);
      });

      return weeklyTopVendors;
    } catch (error) {
      ErrorHandler(error);
    }
  }

  async VendorData(id: string, amount: number) {
    try {
      const vendorFeeds = await FeedsModel.find({ forVendorId: id });
      if (!vendorFeeds)
        throw new Error("Data is not available or vendor has any feedback");

      return vendorFeeds.sort((a, b) => b.feedId - a.feedId).slice(0, amount);
    } catch (error) {
      ErrorHandler(error);
    }
  }

  async GetVendorDashboardData(
    id: string,
    dashboardInput: { field: string; time: string }
  ) {
    try {
      const { field, time } = dashboardInput;

      if (!field || !time) {
        throw new Error("Wrong provided queries");
      }

      const fieldtoLowerCase = field.toLowerCase();

      switch (fieldtoLowerCase) {
        case "feeds":
          const vendor = await VendorModel.findById(id).populate(
            fieldtoLowerCase
          );

          if (!vendor) {
            throw new Error("Vendor not found on data is not available");
          }

          switch (time) {
            case "1D":
              const endDate = new Date();
              const startDate = new Date();
              startDate.setDate(endDate.getDate() - 29);

              const groupFeedsByPerDay = _.groupBy(
                vendor.feeds,
                (feed: FeedbacksDocsType) => {
                  return feed.createdAt.getDate();
                }
              );

              let transformedFeedResult = [];
              for (
                let i = startDate;
                i <= endDate;
                i.setDate(i.getDate() + 1)
              ) {
                const day = i.getDate();

                transformedFeedResult.push({
                  date: day,
                  value: groupFeedsByPerDay[day]
                    ? groupFeedsByPerDay[day].length
                    : 0,
                });
              }

              return transformedFeedResult;
            case "1H":
              const groupFeedsByPerHrs = _.groupBy(
                vendor.feeds,
                (feed: FeedbacksDocsType) => {
                  return feed.createdAt.getHours();
                }
              );

              let transformedFeedsResultByHrs = [];
              for (let hr = 0; hr < 24; hr++) {
                transformedFeedsResultByHrs.push({
                  date: hr,
                  value: groupFeedsByPerHrs[hr]
                    ? groupFeedsByPerHrs[hr].length
                    : 0,
                });
              }
              return transformedFeedsResultByHrs;
            case "1W":
              const groupFeedsByPerWeek = _.groupBy(
                vendor.feeds,
                (feed: FeedbacksDocsType) => {
                  return feed.createdAt.getDay();
                }
              );

              let transformedFeedsResultByWeek = [];
              for (let w = 1; w <= 7; w++) {
                transformedFeedsResultByWeek.push({
                  date: w,
                  value: groupFeedsByPerWeek[w]
                    ? groupFeedsByPerWeek[w].length
                    : 0,
                });
              }
              return transformedFeedsResultByWeek;
            case "1M":
              const groupFeedsByPerMonth = _.groupBy(
                vendor.feeds,
                (feed: FeedbacksDocsType) => {
                  return feed.createdAt.getMonth();
                }
              );

              let transformedFeedsResultByMonth = [];
              for (let m = 0; m <= 11; m++) {
                transformedFeedsResultByMonth.push({
                  date: m + 1,
                  value: groupFeedsByPerMonth[m]
                    ? groupFeedsByPerMonth[m].length
                    : 0,
                });
              }
              return transformedFeedsResultByMonth;
          }
        case "earning":
          const vendorWithEarning = await VendorModel.findById(id).populate({
            path: "orders",
            select: "createdAt total_amount",
          });

          if (!vendorWithEarning) {
            throw new Error("Vendor not found or Data is not available");
          }

          switch (time) {
            case "1D":
              const endDate = new Date();
              const startDate = new Date();
              startDate.setDate(endDate.getDate() - 29);

              const groupOrdersByPerDay = _.groupBy(
                vendorWithEarning.orders,
                (order: OrderDocument) => {
                  return order.createdAt.toISOString().split("T")[0];
                }
              );

              let transformedOrdersResult = [];
              for (
                let i = new Date(startDate);
                i <= endDate;
                i.setDate(i.getDate() + 1)
              ) {
                const isoDate = i.toISOString().split("T")[0];
                const dailyOrders = groupOrdersByPerDay[isoDate] || [];

                const dailyTotalAmount = (
                  dailyOrders as OrderDocument[]
                ).reduce((acc, order) => acc + order.total_amount, 0);

                transformedOrdersResult.push({
                  date: isoDate.split("-")[2],
                  value: dailyTotalAmount,
                });
              }

              return transformedOrdersResult;
            case "1H":
              const groupedOrdersByPerHrs = _.groupBy(
                vendorWithEarning.orders,
                (order: OrderDocument) => {
                  const hour = new Date(order.createdAt).getHours();
                  return hour < 10 ? `0${hour}` : hour;
                }
              );

              let transformedOrdersResultPerHrs = [];
              for (let hr = 0; hr < 24; hr++) {
                const hour = hr < 10 ? `0${hr}` : hr;
                const hourlyOrders = groupedOrdersByPerHrs[hour] || [];

                const totalAmountPerHr = (
                  hourlyOrders as OrderDocument[]
                ).reduce((acc, order) => acc + order.total_amount, 0);

                transformedOrdersResultPerHrs.push({
                  date: hr,
                  value: totalAmountPerHr,
                });
              }

              return transformedOrdersResultPerHrs;
            case "1W":
              const groupedOrdersByWeekDays = _.groupBy(
                vendorWithEarning.orders,
                (order: OrderDocument) => {
                  return new Date(order.createdAt).getDay();
                }
              );

              let transformedOrdersResultWeekDays = [];
              for (let w = 0; w < 7; w++) {
                const weekDaysOrders = groupedOrdersByWeekDays[w] || [];
                const totalAmountWeekDays = (
                  weekDaysOrders as OrderDocument[]
                ).reduce((acc, order) => acc + order.total_amount, 0);

                transformedOrdersResultWeekDays.push({
                  date: w + 1,
                  value: totalAmountWeekDays,
                });
              }
              return transformedOrdersResultWeekDays;
            case "1M":
              const groupedOrdersByMonth = _.groupBy(
                vendorWithEarning.orders,
                (order: OrderDocument) => {
                  return new Date(order.createdAt).getMonth();
                }
              );

              let transformedOrdersResulMonth = [];
              for (let m = 0; m <= 11; m++) {
                const monthlyOrders = groupedOrdersByMonth[m] || [];
                const totalAmountWeekDays = (
                  monthlyOrders as OrderDocument[]
                ).reduce((acc, order) => acc + order.total_amount, 0);

                transformedOrdersResulMonth.push({
                  date: m + 1,
                  value: totalAmountWeekDays,
                });
              }
              return transformedOrdersResulMonth;
          }
        case "orders":
          const vendorOrders = await VendorModel.findById(id).populate(
            fieldtoLowerCase
          );

          if (!vendorOrders) {
            throw new Error("Vendor not found on data is not available");
          }

          switch (time) {
            case "1D":
              const endDate = new Date();
              const startDate = new Date();
              startDate.setDate(endDate.getDate() - 29);

              const groupOrdersByPerDay = _.groupBy(
                vendorOrders.orders,
                (order: OrderDocument) => {
                  return order.createdAt.getDate();
                }
              );

              let transformedOrderResult = [];
              for (
                let i = startDate;
                i <= endDate;
                i.setDate(i.getDate() + 1)
              ) {
                const day = i.getDate();

                transformedOrderResult.push({
                  date: day,
                  value: groupOrdersByPerDay[day]
                    ? groupOrdersByPerDay[day].length
                    : 0,
                });
              }

              return transformedOrderResult;
            case "1H":
              const groupOrderByPerHrs = _.groupBy(
                vendorOrders.orders,
                (order: OrderDocument) => {
                  return order.createdAt.getHours();
                }
              );

              let transformedOrderResultByHrs = [];
              for (let hr = 0; hr < 24; hr++) {
                transformedOrderResultByHrs.push({
                  date: hr,
                  value: groupOrderByPerHrs[hr]
                    ? groupOrderByPerHrs[hr].length
                    : 0,
                });
              }
              return transformedOrderResultByHrs;
            case "1W":
              const groupOrderByPerWeek = _.groupBy(
                vendorOrders.orders,
                (order: OrderDocument) => {
                  return order.createdAt.getDay();
                }
              );

              let transformedOrderResultByWeek = [];
              for (let w = 0; w < 7; w++) {
                transformedOrderResultByWeek.push({
                  date: w + 1,
                  value: groupOrderByPerWeek[w]
                    ? groupOrderByPerWeek[w].length
                    : 0,
                });
              }
              return transformedOrderResultByWeek;
            case "1M":
              const groupOrderByPerMonth = _.groupBy(
                vendorOrders.orders,
                (order: OrderDocument) => {
                  return order.createdAt.getMonth();
                }
              );

              let transformedOrderResultByMonth = [];
              for (let m = 0; m <= 11; m++) {
                transformedOrderResultByMonth.push({
                  date: m + 1,
                  value: groupOrderByPerMonth[m]
                    ? groupOrderByPerMonth[m].length
                    : 0,
                });
              }
              return transformedOrderResultByMonth;
          }
      }
    } catch (error) {
      ErrorHandler(error);
    }
  }

  async GetGallery(vendorId: string) {
    try {
      const vendor = await VendorModel.findById(vendorId)
        .populate({
          path: "gallery",
          options: { sort: { createdAt: -1 } },
        })
        .lean();

      if (!vendor) throw new Error("Error retrieve gallery");

      return vendor.gallery;
    } catch (error) {
      ErrorHandler(error);
    }
  }

  async VendorForOrder(vendorAddress: string) {
    try {
      const vendor = await VendorModel.findOne({
        address: vendorAddress,
      }).lean();

      if (!vendor) throw new Error("Error retrieve vendor");
      const url = `http://localhost:8007/coords/${vendorAddress}`;
      const coords: { latitude: number; longitude: number } =
        await makeRequestWithRetries(url, "GET");

      if (coords) {
        const { latitude, longitude } = coords;
        const { name, address, rating, phone, email, image } = vendor;
        return {
          name,
          address,
          rating,
          phone,
          email,
          image,
          latitude,
          longitude,
        };
      }
    } catch (error) {
      ErrorHandler(error);
    }
  }

  async createNewFeeds(input: FeedbackMessageType) {
    try {
      const newFeedback = await FeedsModel.create(input);
      if (!newFeedback) throw new Error("Error while creating a new feeds");

      const vendor = (await VendorModel.findById(
        input.forVendorId
      )) as VendorDocument;
      if (!vendor) throw new Error("Error while finding the vendor");

      const result = await newFeedback.save();

      vendor.feeds.push(result._id);

      return await vendor.save();
    } catch (error) {
      ErrorHandler(error);
    }
  }

  async createNewOrder(input: MessageOrderType) {
    try {
      const newOrder = await OrderModel.create(input.order);
      if (!newOrder) throw new Error("Error while creating a new order");

      const vendor = (await VendorModel.findOne({
        address: input.vendor_address,
      })) as VendorDocument;

      if (!vendor) throw new Error("Error while finding the vendor");

      const result = await newOrder.save();

      vendor.orders.push(result._id);

      return await vendor.save();
    } catch (error) {
      ErrorHandler(error);
    }
  }

  async updateFeeds(input: FeedbackMessageType) {
    try {
      const feedId = input.feedId;
      const updatedFeedback = await FeedsModel.findOneAndUpdate(
        { feedId: feedId },
        input,
        {
          new: true,
        }
      );

      return updatedFeedback;
    } catch (error) {
      ErrorHandler(error);
    }
  }

  async deleteFeedsFromVendor(feedId: number) {
    try {
      const removedFeed = await FeedsModel.findOneAndRemove({ feedId: feedId });
      return removedFeed;
    } catch (error) {
      ErrorHandler(error);
    }
  }

  async deletePhotoFromVendorGallery(photo: RemovePhotoMsg) {
    try {
      const vendor = await VendorModel.findById(photo.userId);

      if (!vendor) throw new Error("Vendor not found");

      const existingPhoto = await GalleryModel.findOne({ title: photo.title });

      if (!existingPhoto) throw new Error("Photo not found");

      await GalleryModel.findOneAndRemove({
        title: photo.title,
      });

      vendor.gallery = vendor.gallery.filter(
        (el) => el.toString() !== existingPhoto._id.toString()
      );

      return await vendor.save();
    } catch (error) {
      ErrorHandler(error);
    }
  }

  async createFood(input: FoodMessageType) {
    try {
      const newFood = await FoodsModel.create(input);
      if (!newFood) throw new Error("Error while creating a new feeds");

      const savedFood = await newFood.save();
      const vendor = (await VendorModel.findById(
        input.forVendor
      )) as VendorDocument;
      if (!vendor) throw new Error("Error while finding the vendor");

      vendor.foods.push(savedFood._id);

      return await vendor.save();
    } catch (error) {
      ErrorHandler(error);
    }
  }

  async updateFood(input: FoodMessageType) {
    try {
      const foodId = input.foodId;
      const updatedFood = await FoodsModel.findOneAndUpdate(
        { foodId: foodId },
        input,
        {
          new: true,
        }
      );

      return updatedFood;
    } catch (error) {
      ErrorHandler(error);
    }
  }

  async updateVendor(vendorId: string, input: UpdateVendorSchemaType["body"]) {
    try {
      const updatedVendor = await VendorModel.findByIdAndUpdate(
        vendorId,
        input,
        {
          new: true,
        }
      );
      if (!updatedVendor) throw new Error("Error while updating a vendor");
      return omit(updatedVendor?.toJSON, "password");
    } catch (error) {
      ErrorHandler(error);
    }
  }

  async deleteFoodFromVendor(foodId: number) {
    try {
      const removedFood = await FoodsModel.findOneAndRemove({ foodId: foodId });
      return removedFood;
    } catch (error) {
      ErrorHandler(error);
    }
  }
}

export default VendorRepo;
