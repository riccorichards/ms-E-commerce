function getFeedbackEventType(feedbackType: string, type: string) {
  if (type === "add") {
    switch (feedbackType) {
      case "product":
        return "add_feed_in_product";
      case "vendor":
        return "add_feed_in_vendor";
      case "deliveryman":
        return "add_feed_in_deliveryman";
      default:
        return null;
    }
  } else if (type === "update") {
    switch (feedbackType) {
      case "product":
        return "update_feed_in_product";
      case "vendor":
        return "update_feed_in_vendor";
      case "deliveryman":
        return "update_feed_in_deliveryman";
      default:
        return null;
    }
  } else if (type === "delete") {
    switch (feedbackType) {
      case "product":
        return "remove_feed_from_product";
      case "vendor":
        return "remove_feed_from_vendor";
      case "deliveryman":
        return "remove_feed_from_deliveryman";
      default:
        return null;
    }
  }
}

export default getFeedbackEventType;
