import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Toast } from "primereact/toast";
import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const SignUp: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const toast = useRef<Toast>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate form
      if (!formData.name || !formData.email || !formData.password) {
        throw new Error("All fields are required");
      }

      if (!formData.email.includes("@")) {
        throw new Error("Please enter a valid email");
      }

      if (formData.password.length < 6) {
        throw new Error("Password must be at least 6 characters");
      }

      // Password must contain at least one capital letter
      if (!/[A-Z]/.test(formData.password)) {
        throw new Error("Password must contain at least one capital letter");
      }

      // Get existing users
      const users = JSON.parse(localStorage.getItem("users") || "[]");

      // Check if email already exists
      if (users.some((user: any) => user.email === formData.email)) {
        throw new Error("Email already registered");
      }

      // Create new user with role
      const newUser = {
        id: Date.now(),
        name: formData.name,
        email: formData.email,
        role: "user" as const,
        password: btoa(formData.password),
      };

      // Add new user to the list
      users.push(newUser);
      localStorage.setItem("users", JSON.stringify(users));

      toast.current?.show({
        severity: "success",
        summary: "Success",
        detail: "Registration successful! Please sign in.",
        life: 3000,
      });

      // Redirect to login after successful registration
      setTimeout(() => {
        navigate("/signin");
      }, 2000);
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
          <div className="text-900 text-3xl font-medium mb-3">Sign Up</div>
          <span className="text-600 font-medium">Create your account</span>
        </div>

        <form onSubmit={handleSubmit} className="p-fluid">
          <div className="field mb-4">
            <span className="p-float-label">
              <InputText
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full"
              />
              <label htmlFor="name">Name</label>
            </span>
          </div>

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
                className="w-full"
                feedback={true}
              />
              <label htmlFor="password">Password</label>
            </span>
            <small className="text-500">
              Password must be at least 6 characters and contain at least one
              capital letter
            </small>
          </div>

          <Button
            label="Sign Up"
            className="w-full"
            loading={loading}
            type="submit"
          />

          <div className="text-center mt-4">
            <span className="text-600 font-medium">
              Already have an account?{" "}
            </span>
            <Button
              label="Sign In"
              className="p-button-text p-button-plain"
              onClick={() => navigate("/signin")}
            />
          </div>
        </form>
      </Card>
    </div>
  );
};

export default SignUp;
