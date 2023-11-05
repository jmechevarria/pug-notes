type UserSchema = {
  id: string;
  username: string;
  password: string;
  notes: {
    id: string;
    title: string;
    body?: string;
    favorite: boolean;
    dateCreated: string;
  }[];
};

export type DB = {
  users: UserSchema[];
};
