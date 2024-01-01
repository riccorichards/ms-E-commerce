export interface UrlWIthTtile {
  url: string;
  title: string;
}

export interface GalleryMessageType {
  photo: UrlWIthTtile;
  userId: string;
}

export interface ImageMessageType {
  url: string;
  userId: string;
}

export interface RemovePhotoMsg {
  title: string;
  userId: string;
}
