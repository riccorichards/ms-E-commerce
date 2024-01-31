import UserModel from "../models/vendor.model";
import { VendorDocument } from "../types/types.vendor";
import SessionModel from "../models/session.model";
import _, { omit } from "lodash";
import VendorModel from "../models/vendor.model";
import TeamModel from "../models/teamMember.model";
import {
  FeedbackMessageType,
  FeedbacksDocsType,
  UpdateFeedbackWithCustomerInfo,
} from "../types/types.feedbacks";
import FeedsModel from "../models/feedback.model";
import {
  CreateVendorSchemaType,
  UpdateVendorSchemaType,
} from "../../api/middleware/validation/vendor.validation";
import ErrorHandler from "./repoErrorHandler";
import { CreateSessionSchemaType } from "../../api/middleware/validation/session.validation";
import { CreateAddressSchemaType } from "../../api/middleware/validation/address.validation";
import { CreateTeamMemberSchemaType } from "../../api/middleware/validation/team.validation";
import {
  BioValidationType,
  workingDaysValidationType,
} from "../../api/middleware/validation/additional.validation";
import { AddSocialUrlType } from "../../api/middleware/validation/socialUrls.validation";
import { URL } from "node:url";
import FoodsModel from "../models/foods.model";
import { FoodMessageType } from "../types/type.foods";
import { ImageMessageType } from "../types/type.imageUrl";
import GalleryModel from "../models/gallery.model";
import { MessageOrderType, OrderDocument } from "../types/type.order";
import OrderModel from "../models/order.model";
import {
  getCustomerInfo,
  makeRequestWithRetries,
  takeUrl,
} from "../../utils/makeRequestWithRetries";
import Dashboard from "../../utils/dashboard.utils";
import { ObjectId } from "mongoose";

interface VendorTotal {
  vendor: string;
  totalAmount: number;
}

interface WeeklyTopVendors {
  [key: string]: VendorTotal[];
}

class VendorRepo {
  //create vendor
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

  //create session
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

  // add a new team member
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
  //remove team member
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

  //update vendor profile
  async UpdateVendorProfile(
    query: string,
    input: UpdateVendorSchemaType["body"]
  ) {
    try {
      const { name } = input;
      const updatedVendor = await VendorModel.findByIdAndUpdate(query, input, {
        new: true,
      });

      if (!updatedVendor)
        throw new Error("Error while updating vendor profile");

      const feedbacks = await FeedsModel.find({ forVendorId: query });

      if (!feedbacks)
        throw new Error("Feedbacks was not found or data is not available");
      //when name is defined we need to update all feedbacks for specific vendor
      if (name) {
        await Promise.all(
          feedbacks.map(async (feed) => {
            feed.targetTitle = name;

            await feed.save();
          })
        );
      }

      const image = await takeUrl(updatedVendor.image);
      updatedVendor.url = image;
      return updatedVendor;
    } catch (error) {
      ErrorHandler(error);
    }
  }

  //add new address
  async AddVendorAddress(
    query: string,
    input: CreateAddressSchemaType["body"]
  ) {
    try {
      const profile = await VendorModel.findById(query);

      if (!profile) throw new Error("Vendor was not found");

      profile.address = input.address;
      return await profile.save();
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
      vendor.image = input.title;

      const feedbacks = await FeedsModel.find({ forVendorId: input.userId });
      if (!feedbacks) throw new Error("Data was not found");

      await Promise.all(
        feedbacks.map(async (feed) => {
          feed.targetImg = input.title;
          return await feed.save();
        })
      );
      return await vendor.save();
    } catch (error) {
      ErrorHandler(error);
    }
  }

  async UploadGallery(input: ImageMessageType) {
    try {
      const { title, userId } = input;
      const vendor = await VendorModel.findById(userId);
      if (!vendor) throw new Error("Vendor Not Found");
      const addNewGallertPhoto = await GalleryModel.create({
        title,
        userId,
        url: null,
      });
      vendor.gallery.push(addNewGallertPhoto._id);

      return await vendor.save();
    } catch (error) {
      ErrorHandler(error);
    }
  }

  // the function takes event (msg) from the server when happened profile updates
  async updateFeedbackWithCustomerInfo(input: UpdateFeedbackWithCustomerInfo) {
    try {
      const { updatedImage, updatedUsername, userId } = input;

      const feedbacks = await FeedsModel.find({ userId });
      if (!feedbacks)
        throw new Error("Vendor's feeds Not Found or data is not available");

      //updating process via promise
      return await Promise.all(
        feedbacks.map(async (feed) => {
          feed.author = updatedUsername;
          feed.authorImg = updatedImage;
          return await feed.save();
        })
      );
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
      const result = await VendorModel.findById(id).populate({
        path: "feeds",
        options: { sort: { createdAt: -1 } },
      });

      if (!result) throw new Error("Vendor was not found");

      const image = await takeUrl(result.image);
      result.url = image;
      return result;
    } catch (error) {
      ErrorHandler(error);
    }
  }

  //retrieve all vendor's orders
  async GetVendorOrders(id: string, withCustomerInfo: boolean) {
    try {
      //define the vendor with its orders, and select the fields which we want to extract from the per order
      const vendor = await VendorModel.findById(id).populate({
        path: "orders",
        select:
          "order_status total_amount deliverymanName customerId orderId createdAt",
      });

      if (!vendor) throw new Error("Error while getting vendor's orders");

      //so we are using promise to handle all retrieving process
      const ordersPromises = (vendor.orders as OrderDocument[]).map(
        async (order) => {
          //so per order we need to take customers information if keywork is true (withCustomerInfo)
          let customerInfo;
          if (withCustomerInfo) {
            try {
              //define customer's information
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
          //return order based on withCustomerInfo
          return {
            order_status: order.order_status,
            total_amount: order.total_amount,
            deliverymanName: order.deliverymanName,
            customer: withCustomerInfo ? customerInfo : order.customerId,
            orderId: order.orderId,
            createdAt: order.createdAt,
          };
        }
      );
      // wrapping into promise to wait all process to finish
      const orders = await Promise.all(ordersPromises);
      const maxItems = withCustomerInfo ? 10 : orders.length - 1;
      return orders
        .filter((order) => order) // sometimes these is poteltial rick to receive null or undefined, so we need to filter it
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
        .slice(0, maxItems);
    } catch (error) {
      ErrorHandler(error);
    }
  }

  //top customers
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
      //gropued orders based on customer's id
      const groupedByCustomerId = _.groupBy(vendor.orders, "customerId");

      //we are mapping on the grouped object and extracting orders and customer id
      const topCustomers = _.map(
        groupedByCustomerId,
        async (orders, customerId) => {
          //calculate orders sum based on per customer's id
          const totalAmount = _.sumBy(orders, "total_amount");
          try {
            //define customer's information
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

  //retrieve vendor's order items based on provided order's id
  async GetVendorOrderItems(id: string, orderId: number) {
    try {
      const vendor = await VendorModel.findById(id).populate("orders");

      if (!vendor) throw new Error("Error while getting vendor's orders");

      const order = (vendor.orders as OrderDocument[]).find(
        (order) => order.orderId === orderId
      );
      if (!order) throw new Error("Error while finding order");

      const result = await Promise.all(
        order.orderItem.map(async (item) => {
          const image = await takeUrl(item.product_image);
          item.product_image = image;
          return item;
        })
      );
      return result;
    } catch (error) {
      ErrorHandler(error);
    }
  }

  async GetAllVendor() {
    try {
      const result = await VendorModel.find();
      if (!result) throw new Error("Vendors' list is not available");

      return await Promise.all(
        result.map(async (vendor) => {
          const image = await takeUrl(vendor.image);
          if (!image) throw new Error("Error while taken image");
          vendor.image = image;
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
        })
      );
    } catch (error) {
      ErrorHandler(error);
    }
  }

  //return vendor's feedbacks based on page
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

      const vendorFeeds = await Promise.all(
        feedbacks
          .sort((a, b) => b.feedId - a.feedId)
          .map(async (feed) => {
            const imageAuthor = await takeUrl(feed.authorImg);
            const imageTarget = await takeUrl(feed.targetImg);

            feed.authorImg = imageAuthor;
            feed.targetImg = imageTarget;

            return feed;
          })
      );
      return {
        vendorFeeds,
        pagination,
      };
    } catch (error) {
      ErrorHandler(error);
    }
  }

  //return top vendor
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

      //assign empty array to per weekdays
      weekDays.forEach((day) => (weeklyTopVendors[day] = []));

      //iterate oven the vendors
      vendors.forEach((vendor) => {
        //for per vendor we grouped orders based on weekdays to define how many order was created per weekdays for each vendor
        const groupedByDay = _.groupBy(
          vendor.orders,
          (order: OrderDocument) => {
            return weekDays[new Date(order.createdAt).getDay()];
          }
        );

        //then we need to iterate over the weekdays
        weekDays.forEach((day) => {
          //calculate the total amount using grouped orders for per days
          const totalAmount = (
            (groupedByDay[day] as OrderDocument[]) || []
          ).reduce((acc, order) => acc + order.total_amount, 0);
          //assign vendor name and total amount to per day
          weeklyTopVendors[day].push({
            vendor: vendor.name,
            totalAmount,
          });
        });
      });

      //when we need to create a array of key iterate over each key(because it is array)
      Object.keys(weeklyTopVendors).forEach((day) => {
        weeklyTopVendors[day].sort((a, b) => b.totalAmount - a.totalAmount); //sorted
        weeklyTopVendors[day] = weeklyTopVendors[day].slice(0, 5);
      });

      return weeklyTopVendors;
    } catch (error) {
      ErrorHandler(error);
    }
  }
  //the function returns vendor's feedback
  async VendorData(id: string, amount: number) {
    try {
      //grab vendor's feedbacks with limitation
      const vendorFeeds = await FeedsModel.find({ forVendorId: id }).limit(
        amount
      );
      if (!vendorFeeds)
        throw new Error("Data is not available or vendor has any feedback");

      // converted image title into signed url and sorted it based on feedId
      const result = await Promise.all(
        vendorFeeds
          .sort((a, b) => b.feedId - a.feedId)
          .map(async (feed) => {
            const authorImg = await takeUrl(feed.authorImg);
            const targetImg = await takeUrl(feed.targetImg);

            feed.authorImg = authorImg;
            feed.targetImg = targetImg;

            return feed;
          })
      );
      return result;
    } catch (error) {
      ErrorHandler(error);
    }
  }

  async GetFoods(id: string) {
    try {
      const foods = await FoodsModel.find({ forVendor: id });
      if (!foods) throw new Error("Data is not available");
      const result = await Promise.all(
        foods.map(async (food) => {
          const image = await takeUrl(food.image);
          food.url = image;
          return food;
        })
      );
      return result;
    } catch (error) {
      ErrorHandler(error);
    }
  }

  // gain all necessary information about vendor for dashboard. the function takes some information to detect what kind of data it needs to retrieve
  async GetVendorDashboardData(
    id: string,
    dashboardInput: { field: string; time: string }
  ) {
    try {
      //extractiong field and time
      const { field, time } = dashboardInput;

      if (!field || !time) {
        throw new Error("Wrong provided queries");
      }
      //we need to convert it into lower case to easily define populations
      const fieldtoLowerCase = field.toLowerCase();

      //we use switch to create cases
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
              return Dashboard.feedbackTimeInterval1D(vendor.feeds);
            case "1H":
              return Dashboard.feedbackTimeInterval1H(vendor.feeds);
            case "1W":
              return Dashboard.feedbackTimeInterval1W(vendor.feeds);
            case "1M":
              return Dashboard.feedbackTimeInterval1M(vendor.feeds);
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
              return Dashboard.earningTimeInterval1D(
                vendorWithEarning.orders as []
              );
            case "1H":
              return Dashboard.earningTimeInterval1H(
                vendorWithEarning.orders as []
              );
            case "1W":
              return Dashboard.earningTimeInterval1W(
                vendorWithEarning.orders as []
              );
            case "1M":
              return Dashboard.earningTimeInterval1M(
                vendorWithEarning.orders as []
              );
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
              return Dashboard.ordersTimeInterval1D(vendorOrders.orders as []);
            case "1H":
              return Dashboard.ordersTimeInterval1H(vendorOrders.orders as []);
            case "1W":
              return Dashboard.ordersTimeInterval1W(vendorOrders.orders as []);
            case "1M":
              return Dashboard.ordersTimeInterval1M(vendorOrders.orders as []);
          }
      }
    } catch (error) {
      ErrorHandler(error);
    }
  }

  async GetGallery(vendorId: string) {
    try {
      const gallery = await GalleryModel.find({ userId: vendorId });

      if (!gallery) throw new Error("Error retrieve gallery");

      const result = await Promise.all(
        gallery.map(async (img) => {
          const url = `http://localhost:8007/file?title=${img.title}`;
          const image = await makeRequestWithRetries(url, "GET");
          if (!image) throw new Error("Error while taken image");
          img.url = image;
          return img;
        })
      );

      return result.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    } catch (error) {
      ErrorHandler(error);
    }
  }

  async UpdateProfile(vendorId: string, photoTitle: string) {
    try {
      const vendor = await VendorModel.findById(vendorId);

      if (!vendor) throw new Error("Vendor was not found");
      vendor.image = photoTitle;
      await vendor.save();

      //also we need to update feeds
      const feedbacks = await FeedsModel.find({ forVendorId: vendorId });
      feedbacks.map(async (feed) => {
        feed.targetImg = photoTitle;
        return await feed.save();
      });

      const image = await takeUrl(vendor.image);
      if (!image) throw new Error("Error while taken image");

      vendor.image = image;
      return vendor.image;
    } catch (error) {
      ErrorHandler(error);
    }
  }

  //retrieve vendor's information for order based on provided vendor's address
  async VendorForOrder(vendorAddress: string) {
    try {
      const vendor = await VendorModel.findOne({
        address: vendorAddress,
      }).lean();
      if (!vendor) throw new Error("Error retrieve vendor");

      const imgUrl = await takeUrl(vendor.image);

      const url = `http://localhost:8007/coords?address=${vendorAddress}`;
      const coords: { latitude: number; longitude: number } =
        await makeRequestWithRetries(url, "GET");

      if (coords) {
        const { latitude, longitude } = coords;
        const { name, address, rating, phone, email } = vendor;
        return {
          name,
          address,
          rating,
          phone,
          email,
          image: imgUrl,
          latitude,
          longitude,
        };
      }
    } catch (error) {
      ErrorHandler(error);
    }
  }

  //the function takes msg from feedback server to create new feedback, it happened because we need to make our services more independently
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
  // the same as feedback case
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
  //removing feedback
  async deleteFeedsFromVendor(feedId: number) {
    try {
      const removedFeed = await FeedsModel.findOneAndRemove({ feedId: feedId });
      return removedFeed;
    } catch (error) {
      ErrorHandler(error);
    }
  }
  // remove image from vendor's galley
  async deletePhotoFromVendorGallery(photo: ImageMessageType) {
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
  // we listening the msg from the product service and add a new product
  async createFood(input: FoodMessageType) {
    try {
      const newFood = await FoodsModel.create({ ...input, url: null });
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

  //update vendor
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

      //also we need to update feeds
      const feedbacks = await FeedsModel.find({ forVendorId: vendorId });
      feedbacks.map(async (feed) => {
        feed.targetTitle = updatedVendor.name;
        return await feed.save();
      });

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
