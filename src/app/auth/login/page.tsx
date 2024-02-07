"use client";

import { supabase } from "@/lib/supabase";
import { Button, Input, Spinner } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Page() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const router = useRouter();

  async function handleSubmit() {
    setLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (data) {
      console.log(data);
      setLoading(false);
      router.push("/home");
    }

    if (error) {
      console.log(error);
      setLoading(false);
      window.alert("An Error Occured! Please try again later");
    }
  }

  return (
    <div className="flex flex-col min-h-screen items-center justify-start bg-transparent w-[99%] mx-auto shadow-lg rounded-lg">
      <div className="flex justify-center items-center flex-col w-full h-full">
        <p className="text-2xl font-bold mt-4">Login</p>
        <div className="py-10 mt-2 mb-6">
          <Input
            className="w-80 my-2"
            name="email"
            value={email}
            type="email"
            label="Email"
            placeholder=""
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            className="w-80 my-2"
            name="password"
            value={password}
            type="password"
            label="Password"
            placeholder=""
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {loading ? (
          <Button className="text-center">
            <Spinner size="sm" />
          </Button>
        ) : (
          <Button color="primary" variant="flat" onClick={handleSubmit}>
            Submit
          </Button>
        )}
      </div>
    </div>
  );
}
