export interface ForumDataInterface {
  _id: string;
  postedBy: {
    _id: string;
    username: string;
  };
  title: string;
  createdAt: string;
  updatedAt: string;
  image: string;
  reports: {
    count: number;
    reasons: {
      date: string;
      reason: string;
      user: {
        _id: string | null;
        username?: string;
      } | null;
    }[];
    users: string[];
  };
}
