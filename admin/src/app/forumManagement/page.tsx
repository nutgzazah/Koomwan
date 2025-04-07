'use client';

import React, { useEffect, useState } from "react";
import axios from "axios";
import ForumTable from "./components/ForumTable";
import { ForumDataInterface } from "@/interfaces/forumInterface";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:8080";

export default function ForumManagement() {
  const [forumList, setForumList] = useState<ForumDataInterface[]>([]);

  useEffect(() => {
    const fetchForums = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/v1/admin/forum/reported`);
        console.log("Fetched forum data:", response.data);
        setForumList(response.data); 
      } catch (error) {
        console.error("Error fetching forum data:", error);
      }
    };

    fetchForums(); 
  }, []); 

  return (
    <div className="w-full">
      <ForumTable forums={forumList} />
    </div>
  );
}
