import { contextBridge, ipcRenderer } from "electron";
import { Category, Record } from "./class/Store";

const electronHandler = {
  openUrl: (url: string) => ipcRenderer.invoke("openUrl", url),
  getCategories: () => ipcRenderer.invoke("getCategories"),
  getCategory: (id: string) => ipcRenderer.invoke("getCategory", id),
  isCategoryNameDuplicated: (id: string, name: string) =>
    ipcRenderer.invoke("isCategoryNameDuplicated", id, name),
  addCategory: (newCategory: Category) =>
    ipcRenderer.invoke("addCategory", newCategory),
  updateCategory: (newCategory: Category) =>
    ipcRenderer.invoke("updateCategory", newCategory),
  removeCategory: (id: string) => ipcRenderer.invoke("removeCategory", id),
  doesCategoryHaveRecords: (id: string) =>
    ipcRenderer.invoke("doesCategoryHaveRecords", id),
  getTags: () => ipcRenderer.invoke("getTags"),
  getRecords: () => ipcRenderer.invoke("getRecords"),
  getRecord: (id: string) => ipcRenderer.invoke("getRecord", id),
  getRecordsByCategory: (id: string) =>
    ipcRenderer.invoke("getRecordsByCategory", id),
  addRecord: (record: Record) => ipcRenderer.invoke("addRecord", record),
  updateRecord: (record: Record) => ipcRenderer.invoke("updateRecord", record),
  deleteRecord: (id: string) => ipcRenderer.invoke("deleteRecord", id),
  isRecordNameDuplicated: (id: string, name: string) =>
    ipcRenderer.invoke("isRecordNameDuplicated", id, name),
};

contextBridge.exposeInMainWorld("electron", electronHandler);

export type ElectronHandler = typeof electronHandler;
