import { databases } from "./config";
import { ID } from "appwrite";

const db = {};

const collections = [
    {
        dbId: import.meta.env.VITE_DATABASE_ID,
        id: import.meta.env.VITE_COLLECTION_BLOG,
        name: "blog",
    },
    
    {
        dbId: import.meta.env.VITE_DATABASE_ID,
        id: import.meta.env.VITE_COLLECTION_MANAS,
        name: "manas",
    },
];

collections.forEach((col) => {
    db[col.name] = {
        create: (payload, permissions, id = ID.unique()) =>
            databases.createDocument(
                col.dbId,
                col.id,
                id,
                payload,
                permissions
            ),
        update: (id, payload, permissions) =>
            databases.updateDocument(
                col.dbId,
                col.id,
                id,
                payload,
                permissions
            ),
        delete: (id) => databases.deleteDocument(col.dbId, col.id, id),

        list: (queries = []) =>
            databases.listDocuments(col.dbId, col.id, queries),

        get: (id) => databases.getDocument(col.dbId, col.id, id),
    };
});

export default db;