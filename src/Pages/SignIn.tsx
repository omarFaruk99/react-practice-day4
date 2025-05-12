import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Toast } from "primereact/toast";
import React, { useContext, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../GlobalProvider/GlobalProvider";
import useStore from "../layout/useStore";

const SignIn: React.FC = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const toast = useRef<Toast>(null);
  const { data } = useContext(AuthContext);
  const { setCurrentUser } = useStore().data;

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

      // Verify password (using the same basic encoding as signup)
      if (btoa(formData.password) !== user.password) {
        throw new Error("Invalid password");
      }

      // Create user session
      const userSession = {
        id: user.id,
        name: user.name,
        email: user.email,
      };

      // Store user session in localStorage and global state
      localStorage.setItem("currentUser", JSON.stringify(userSession));
      setCurrentUser(userSession);

      // Set access token (as per your existing context structure)
      data.setAccessToken(btoa(user.email)); // Using email as base64 token for demo

      toast.current?.show({
        severity: "success",
        summary: "Success",
        detail: "Welcome back!",
        life: 3000,
      });

      // Redirect to profile page
      setTimeout(() => {
        navigate("/profile");
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
                feedback={false}
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
