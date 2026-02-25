import { useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

const API_URL = `${import.meta.env.VITE_API_URL || "http://localhost:3001"}/api/users`;

const RegisterUserPage = () => {
  const { toast } = useToast();

  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.email || !form.password) {
      toast({
        title: "❌ Campos incompletos",
        description: "Email y password son obligatorios.",
        variant: "destructive",
      });
      return;
    }

    if (form.password !== form.confirmPassword) {
      toast({
        title: "❌ Password no coincide",
        description: "Confirma la contraseña correctamente.",
        variant: "destructive",
      });
      return;
    }

    const token = localStorage.getItem("auth_token"); // 👈 tu key real

    if (!token) {
      toast({
        title: "❌ Token no encontrado",
        description: "Inicia sesión nuevamente para registrar usuarios.",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);

      await axios.post(
        API_URL,
        {
          email: form.email,
          password: form.password,
          role: "admin", // ✅ por defecto admin
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast({
        title: "✅ Usuario creado",
        description: "El nuevo admin fue registrado correctamente.",
      });

      setForm({
        email: "",
        password: "",
        confirmPassword: "",
      });
    } catch (error: any) {
      console.error(error);

      toast({
        title: "❌ Error creando usuario",
        description: error?.response?.data?.error ?? "No se pudo crear el usuario.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-foreground">Registrar nuevo administrador</h1>
        <p className="text-muted-foreground">
          Este formulario crea un nuevo usuario con rol <b>admin</b>.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 bg-card border border-border rounded-xl p-6">
        <div className="space-y-2">
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            type="email"
            value={form.email}
            onChange={(e) => handleChange("email", e.target.value)}
            placeholder="nuevoadmin@carnet.com"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password *</Label>
          <Input
            id="password"
            type="password"
            value={form.password}
            onChange={(e) => handleChange("password", e.target.value)}
            placeholder="********"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirmar Password *</Label>
          <Input
            id="confirmPassword"
            type="password"
            value={form.confirmPassword}
            onChange={(e) => handleChange("confirmPassword", e.target.value)}
            placeholder="********"
            required
          />
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button type="submit" disabled={loading}>
            {loading ? "Registrando..." : "Registrar admin"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default RegisterUserPage;
