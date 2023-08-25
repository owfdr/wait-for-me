import { ipcMain } from "electron";
import ElectronStore from "electron-store";
import { nanoid } from "nanoid";

export type Category = {
  id: string;
  name: string;
  password: string;
};

export type Tag = {
  id: string;
  name: string;
};

export type Record = {
  id: string;
  name: string;
  imageUrl: string;
  sourceUrl: string;

  stage: number;
  note: string;
  upvote: number;

  tags: string[];
  categoryId: string;
};

export default class Store {
  store: ElectronStore;

  constructor() {
    this.store = new ElectronStore();
  }

  init() {
    const book: Category = {
      id: nanoid(),
      name: "Book",
      password: "",
    };

    const movie: Category = {
      id: nanoid(),
      name: "Movie",
      password: "",
    };

    const ThinkingFastAndSlow: Record = {
      id: nanoid(),
      name: "Thinking, Fast and Slow",
      imageUrl:
        "https://upload.wikimedia.org/wikipedia/en/c/c1/Thinking%2C_Fast_and_Slow.jpg",
      sourceUrl:
        "https://www.amazon.com/Thinking-Fast-Slow-Daniel-Kahneman/dp/0374275637",
      stage: 0,
      note: "",
      upvote: 0,
      tags: [],
      categoryId: book.id,
    };

    if (!this.store.has("categories")) {
      this.store.set("categories", [book, movie]);
    }

    if (!this.store.has("tags")) {
      this.store.set("tags", []);
    }

    if (!this.store.has("records")) {
      this.store.set("records", [ThinkingFastAndSlow]);
    }
  }

  flush() {
    this.store.clear();
  }

  getCategories() {
    return this.store.get("categories") as Category[];
  }

  getCategory(id: string) {
    return this.getCategories().find((category) => category.id === id);
  }

  isCategoryNameDuplicated(id: string, name: string) {
    return this.getCategories().some(
      (each) => each.id !== id && each.name.toLowerCase() === name.toLowerCase()
    );
  }

  addCategory(newCategory: Category) {
    this.store.set("categories", [...this.getCategories(), newCategory]);
  }

  updateCategory(newCategory: Category) {
    this.store.set(
      "categories",
      this.getCategories().map((category) =>
        category.id === newCategory.id ? newCategory : category
      )
    );
  }

  removeCategory(id: string) {
    this.store.set(
      "categories",
      this.getCategories().filter((category) => category.id !== id)
    );
  }

  doesCategoryHaveRecords(id: string) {
    const category = this.getCategory(id);

    return this.getRecords().some(
      (record) => record.categoryId === category.id
    );
  }

  getTags() {
    return this.store.get("tags") as Tag[];
  }

  getRecords() {
    return this.store.get("records") as Record[];
  }

  getRecord(id: string) {
    return this.getRecords().find((record) => record.id === id);
  }

  getRecordsByCategory(id: string) {
    const category = this.getCategory(id);

    return this.getRecords().filter(
      (record) => record.categoryId === category.id
    );
  }

  addRecord(record: Record) {
    this.store.set("records", [...this.getRecords(), record]);
  }

  updateRecord(record: Record) {
    this.store.set(
      "records",
      this.getRecords().map((each) => (each.id === record.id ? record : each))
    );
  }

  deleteRecord(id: string) {
    this.store.set(
      "records",
      this.getRecords().filter((record) => record.id !== id)
    );
  }

  isRecordNameDuplicated(id: string, name: string) {
    return this.getRecords().some(
      (record) =>
        record.id !== id && record.name.toLowerCase() === name.toLowerCase()
    );
  }

  listen() {
    ipcMain.handle("getCategories", () => this.getCategories());
    ipcMain.handle("getCategory", (_, id: string) => this.getCategory(id));
    ipcMain.handle("isCategoryNameDuplicated", (_, id: string, name: string) =>
      this.isCategoryNameDuplicated(id, name)
    );
    ipcMain.handle("addCategory", (_, newCategory: Category) =>
      this.addCategory(newCategory)
    );
    ipcMain.handle("updateCategory", (_, newCategory: Category) =>
      this.updateCategory(newCategory)
    );
    ipcMain.handle("removeCategory", (_, id: string) =>
      this.removeCategory(id)
    );
    ipcMain.handle("doesCategoryHaveRecords", (_, id: string) =>
      this.doesCategoryHaveRecords(id)
    );
    ipcMain.handle("getTags", () => this.getTags());
    ipcMain.handle("getRecords", () => this.getRecords());
    ipcMain.handle("getRecord", (_, id: string) => this.getRecord(id));
    ipcMain.handle("getRecordsByCategory", (_, id: string) => {
      return this.getRecordsByCategory(id);
    });
    ipcMain.handle("addRecord", (_, record: Record) => this.addRecord(record));
    ipcMain.handle("updateRecord", (_, record: Record) =>
      this.updateRecord(record)
    );
    ipcMain.handle("deleteRecord", (_, id: string) => this.deleteRecord(id));
    ipcMain.handle("isRecordNameDuplicated", (_, id: string, name: string) =>
      this.isRecordNameDuplicated(id, name)
    );
  }
}
