import { type Data } from "@puckeditor/core";

export interface PageResponse {
  success: boolean;
  data: {
    content: Data;
  };
}
