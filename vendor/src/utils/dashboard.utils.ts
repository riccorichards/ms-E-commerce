import _ from "lodash";
import { FeedbacksDocsType } from "../database/types/types.feedbacks";
import { ObjectId } from "mongoose";
import { OrderDocument } from "../database/types/type.order";

//the class is gain all method for grab the data nicely
class Dashboard {
  static feedbackTimeInterval1D(vendorFeeds: ObjectId[]) {
    const endDate = new Date(); //define endDate, it is important to define distance between start date and end date, in this case we need to handle 30 days, from 1 to 30.
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - 29); // we would be able to see data per day from 1 to 30

    //grouping grabed feedback fr per day to show how many feedback received vendor from the customer per days
    const groupFeedsByPerDay = _.groupBy(
      vendorFeeds,
      (feed: FeedbacksDocsType) => {
        return feed.createdAt.getDate();
      }
    );
    //create empty array for push in the future the result of per days
    let transformedFeedResult = [];
    //the iteration process starts from 1 = startDate and goes until endDate, so we have the entire monthly result defined per days
    for (let i = startDate; i <= endDate; i.setDate(i.getDate() + 1)) {
      const day = i.getDate();

      transformedFeedResult.push({
        date: day,
        value: groupFeedsByPerDay[day] ? groupFeedsByPerDay[day].length : 0,
      });
    }

    return transformedFeedResult;
  }

  static feedbackTimeInterval1H(vendorFeeds: ObjectId[]) {
    const groupFeedsByPerHrs = _.groupBy(
      vendorFeeds,
      (feed: FeedbacksDocsType) => {
        return feed.createdAt.getHours();
      }
    );

    let transformedFeedsResultByHrs = [];
    //because of we need to define hour and we have 24 hours per day, we need to iterate 24 times and grab data based on per hour
    for (let hr = 0; hr < 24; hr++) {
      transformedFeedsResultByHrs.push({
        date: hr,
        value: groupFeedsByPerHrs[hr] ? groupFeedsByPerHrs[hr].length : 0,
      });
    }
    return transformedFeedsResultByHrs;
  }

  static feedbackTimeInterval1W(vendorFeeds: ObjectId[]) {
    const groupFeedsByPerWeek = _.groupBy(
      vendorFeeds,
      (feed: FeedbacksDocsType) => {
        return feed.createdAt.getDay();
      }
    );

    let transformedFeedsResultByWeek = [];
    //works like other, but only weekdays
    for (let w = 1; w <= 7; w++) {
      transformedFeedsResultByWeek.push({
        date: w,
        value: groupFeedsByPerWeek[w] ? groupFeedsByPerWeek[w].length : 0,
      });
    }
    return transformedFeedsResultByWeek;
  }

  static feedbackTimeInterval1M(vendorFeeds: ObjectId[]) {
    const groupFeedsByPerMonth = _.groupBy(
      vendorFeeds,
      (feed: FeedbacksDocsType) => {
        return feed.createdAt.getMonth();
      }
    );

    let transformedFeedsResultByMonth = [];
    
    for (let m = 0; m <= 11; m++) {
      transformedFeedsResultByMonth.push({
        date: m + 1,
        value: groupFeedsByPerMonth[m] ? groupFeedsByPerMonth[m].length : 0,
      });
    }
    return transformedFeedsResultByMonth;
  }

  static earningTimeInterval1D(vendorOrders: OrderDocument[]) {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - 29);

    const groupOrdersByPerDay = _.groupBy(
      vendorOrders,
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

      const dailyTotalAmount = (dailyOrders as OrderDocument[]).reduce(
        (acc, order) => acc + order.total_amount,
        0
      );

      transformedOrdersResult.push({
        date: isoDate.split("-")[2],
        value: dailyTotalAmount,
      });
    }

    return transformedOrdersResult;
  }

  static earningTimeInterval1H(vendorOrders: OrderDocument[]) {
    const groupedOrdersByPerHrs = _.groupBy(
      vendorOrders,
      (order: OrderDocument) => {
        const hour = new Date(order.createdAt).getHours();
        return hour < 10 ? `0${hour}` : hour;
      }
    );

    let transformedOrdersResultPerHrs = [];
    for (let hr = 0; hr < 24; hr++) {
      const hour = hr < 10 ? `0${hr}` : hr;
      const hourlyOrders = groupedOrdersByPerHrs[hour] || [];

      const totalAmountPerHr = (hourlyOrders as OrderDocument[]).reduce(
        (acc, order) => acc + order.total_amount,
        0
      );

      transformedOrdersResultPerHrs.push({
        date: hr,
        value: totalAmountPerHr,
      });
    }

    return transformedOrdersResultPerHrs;
  }

  static earningTimeInterval1W(vendorOrders: OrderDocument[]) {
    const groupedOrdersByWeekDays = _.groupBy(
      vendorOrders,
      (order: OrderDocument) => {
        return new Date(order.createdAt).getDay();
      }
    );

    let transformedOrdersResultWeekDays = [];
    for (let w = 0; w < 7; w++) {
      const weekDaysOrders = groupedOrdersByWeekDays[w] || [];
      const totalAmountWeekDays = (weekDaysOrders as OrderDocument[]).reduce(
        (acc, order) => acc + order.total_amount,
        0
      );

      transformedOrdersResultWeekDays.push({
        date: w + 1,
        value: totalAmountWeekDays,
      });
    }
    return transformedOrdersResultWeekDays;
  }

  static earningTimeInterval1M(vendorOrders: OrderDocument[]) {
    const groupedOrdersByMonth = _.groupBy(
      vendorOrders,
      (order: OrderDocument) => {
        return new Date(order.createdAt).getMonth();
      }
    );

    let transformedOrdersResulMonth = [];
    for (let m = 0; m <= 11; m++) {
      const monthlyOrders = groupedOrdersByMonth[m] || [];
      const totalAmountWeekDays = (monthlyOrders as OrderDocument[]).reduce(
        (acc, order) => acc + order.total_amount,
        0
      );

      transformedOrdersResulMonth.push({
        date: m + 1,
        value: totalAmountWeekDays,
      });
    }
    return transformedOrdersResulMonth;
  }

  static ordersTimeInterval1D(vendorOrders: OrderDocument[]) {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - 29);

    const groupOrdersByPerDay = _.groupBy(
      vendorOrders,
      (order: OrderDocument) => {
        return order.createdAt.getDate();
      }
    );

    let transformedOrderResult = [];
    for (let i = startDate; i <= endDate; i.setDate(i.getDate() + 1)) {
      const day = i.getDate();

      transformedOrderResult.push({
        date: day,
        value: groupOrdersByPerDay[day] ? groupOrdersByPerDay[day].length : 0,
      });
    }

    return transformedOrderResult;
  }

  static ordersTimeInterval1H(vendorOrders: OrderDocument[]) {
    const groupOrderByPerHrs = _.groupBy(
      vendorOrders,
      (order: OrderDocument) => {
        return order.createdAt.getHours();
      }
    );

    let transformedOrderResultByHrs = [];
    for (let hr = 0; hr < 24; hr++) {
      transformedOrderResultByHrs.push({
        date: hr,
        value: groupOrderByPerHrs[hr] ? groupOrderByPerHrs[hr].length : 0,
      });
    }
    return transformedOrderResultByHrs;
  }

  static ordersTimeInterval1W(vendorOrders: OrderDocument[]) {
    const groupOrderByPerWeek = _.groupBy(
      vendorOrders,
      (order: OrderDocument) => {
        return order.createdAt.getDay();
      }
    );

    let transformedOrderResultByWeek = [];
    for (let w = 0; w < 7; w++) {
      transformedOrderResultByWeek.push({
        date: w + 1,
        value: groupOrderByPerWeek[w] ? groupOrderByPerWeek[w].length : 0,
      });
    }
    return transformedOrderResultByWeek;
  }

  static ordersTimeInterval1M(vendorOrders: OrderDocument[]) {
    const groupOrderByPerMonth = _.groupBy(
      vendorOrders,
      (order: OrderDocument) => {
        return order.createdAt.getMonth();
      }
    );

    let transformedOrderResultByMonth = [];
    for (let m = 0; m <= 11; m++) {
      transformedOrderResultByMonth.push({
        date: m + 1,
        value: groupOrderByPerMonth[m] ? groupOrderByPerMonth[m].length : 0,
      });
    }
    return transformedOrderResultByMonth;
  }
}

export default Dashboard;
