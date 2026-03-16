import Dexie, { type Table } from "dexie";

export interface Notebook {
  id?: number; // auto-increased primary key
  title: string;
  createdAt: Date;
}

export interface Page {
  id?: string; // UUID
  notebookId: number; // foreign key to Notebook
  title: string;
  canvasData: any;
  createdAt: Date;
  updatedAt: Date;
}

export class NotedDatabase extends Dexie {
  notebooks!: Table<Notebook>;
  pages!: Table<Page>;

  constructor() {
    super("NotedDB");

    this.version(1).stores({
      notebooks: "++id, title, createdAt",
      pages: "id, notebookId, title, updatedAt", // notebookId is indexed for quick loading of all pages for a specific notebook
    });
  }
}

export const db = new NotedDatabase();
