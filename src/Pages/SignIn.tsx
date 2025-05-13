import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Toast } from "primereact/toast";
import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../GlobalProvider/useData/AuthContext";

const SignIn: React.FC = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const toast = useRef<Toast>(null);
  const { setCurrentUser } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate form
      if (!formData.email || !formData.password) {
        throw new Error("All fields are required");
      }

      // Get users from localStorage
      const users = JSON.parse(localStorage.getItem("users") || "[]");

      // Find user with matching email
      const user = users.find((u: any) => u.email === formData.email);

      if (!user) {
        throw new Error("User not found");
      }

      // Check if it's admin login
      if (user.role === "admin") {
        const adminPassword = localStorage.getItem("adminPassword");
        if (btoa(formData.password) !== adminPassword) {
          throw new Error("Invalid password");
        }
      } else {
        // Regular user login
        if (btoa(formData.password) !== user.password) {
          throw new Error("Invalid password");
        }
      }

      // Store user session in localStorage and global state
      localStorage.setItem("currentUser", JSON.stringify(user));
      setCurrentUser(user);

      toast.current?.show({
        severity: "success",
        summary: "Success",
        detail: "Welcome back!",
        life: 3000,
      });

      // Redirect to tasks page
      setTimeout(() => {
        navigate("/tasks");
      }, 1500);
    } catch (error: any) {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: error.message,
        life: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex align-items-center justify-content-center min-h-screen">
      <Toast ref={toast} />
      <Card className="w-full md:w-6 lg:w-4">
        <div className="text-center mb-5">
          <div className="text-900 text-3xl font-medium mb-3">Sign In</div>
          <span className="text-600 font-medium">Welcome back</span>
        </div>

        <form onSubmit={handleSubmit} className="p-fluid">
          <div className="field mb-4">
            <span className="p-float-label">
              <InputText
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full"
              />
              <label htmlFor="email">Email</label>
            </span>
          </div>

          <div className="field mb-4">
            <span className="p-float-label">
              <Password
                id="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                toggleMask
                feedback={true}
                className="w-full"
              />
              <label htmlFor="password">Password</label>
            </span>
          </div>

          <Button
            label="Sign In"
            className="w-full"
            loading={loading}
            type="submit"
          />

          <div className="text-center mt-4">
            <span className="text-600 font-medium">
              Don't have an account?{" "}
            </span>
            <Button
              label="Sign Up"
              className="p-button-text p-button-plain"
              onClick={() => navigate("/signup")}
            />
          </div>
        </form>
      </Card>
    </div>
  );
};

export default SignIn;
