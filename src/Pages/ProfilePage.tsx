import { Avatar } from "primereact/avatar";
import { Card } from "primereact/card";
import { Divider } from "primereact/divider";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface UserProfile {
  id: number;
  name: string;
  email: string;
}

const ProfilePage: React.FC = () => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Get user data from localStorage
    const userData = localStorage.getItem("currentUser");
    if (!userData) {
      navigate("/login");
      return;
    }
    setUserProfile(JSON.parse(userData));
  }, [navigate]);

  if (!userProfile) {
    return null;
  }

  return (
    <div className="flex justify-content-center align-items-center min-h-screen">
      <Card className="w-full md:w-8 lg:w-6">
        <div className="flex flex-column align-items-center text-center mb-4">
          <Avatar
            icon="pi pi-user"
            size="xlarge"
            shape="circle"
            className="mb-3"
            style={{
              width: "100px",
              height: "100px",
              backgroundColor: "var(--primary-color)",
              color: "#ffffff",
            }}
          />
          <h2 className="text-2xl font-bold m-0">{userProfile.name}</h2>
          <p className="text-500 mt-2">{userProfile.email}</p>
        </div>

        <Divider />

        <div className="grid p-4">
          <div className="col-12 md:col-6">
            <div className="text-500 font-medium mb-2">User ID</div>
            <div className="text-900">{userProfile.id}</div>
          </div>
          <div className="col-12 md:col-6">
            <div className="text-500 font-medium mb-2">Name</div>
            <div className="text-900">{userProfile.name}</div>
          </div>
          <div className="col-12 mt-4">
            <div className="text-500 font-medium mb-2">Email</div>
            <div className="text-900">{userProfile.email}</div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ProfilePage;
