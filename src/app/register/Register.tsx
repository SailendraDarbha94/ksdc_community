"use client";
import React, { useState, useEffect, useContext } from "react";
import GoogleMap from "@/app/register/GoogleMap";
import { Button, Input, Textarea } from "@nextui-org/react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { Coordinates } from "@/constants/interfaces";
import ToastContext from "@/lib/toastContext";
import { getLatLngObj } from "@/lib/utils";

export default function Register({user}:any) {
  const [manualAddress, setManualAddress] = useState<boolean>(false);
  const [name, setName] = useState<string>("");
  const [desc, setDesc] = useState<string>("");
  const [timings, setTimings] = useState<string>("");
  const [regNo, setRegNo] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false)
  const [coords, setCoords] = useState<Coordinates>({
    lat: 0,
    lng: 0
  })
  const router = useRouter();
  const {toast} = useContext(ToastContext);
  // useEffect(() => {
  //   async function userIsThere() {
  //     const {
  //       data: { user },
  //     } = await supabase.auth.getUser();

  //     if (!user) {
  //       router.push("/auth");
  //     }
  //   }
  //   userIsThere();
  // }, []);

  const handleAddressChange = (newAddress: any) => {
    setAddress(newAddress.address);
    setCoords(newAddress.coords)
  };

  async function handleSubmit() {
    setLoading(true)
    const obj = {
      name: name,
      description: desc,
      timings: timings,
      registration_number: regNo,
      coordinates: manualAddress ? await getLatLngObj(address) : coords,
      address: address,
      creator: user.id
    };

    //console.log(obj)

    const { data, error } = await supabase
      .from("clinics")
      .insert([{...obj}])
      .select();

    if(error){
      toast({
        message: "An Error Occured, PLease Try Again Later!",
        type: "error"
      })
      setLoading(false)
      console.log(error)
      return
    }

    if(!error && data){
      setLoading(false)
      toast({
        message: "Clinic Registered Successfully",
        type: "success"
      })
      router.push('/dashboards/clinic')
    }
    setLoading(false)
  }

  return (
    <main className="flex flex-wrap flex-col md:flex-row min-h-screen items-start justify-center p-4 bg-transparent w-[99%] mx-auto shadow-lg rounded-lg">
      <div className="flex flex-col w-full justify-center items-center md:w-[40%] mx-auto rounded-lg shadow-lg shadow-slate-300 p-4">
        <Input
          className="max-w-80 my-2"
          name="name"
          value={name}
          type="text"
          label="Name"
          placeholder=""
          onChange={(e) => setName(e.target.value)}
        />
        <Input
          className="max-w-80 my-2"
          name="timings"
          value={timings}
          type="text"
          label="Timings"
          placeholder="09:00AM - 02:00PM,03:30PM - 07:30PM etc"
          onChange={(e) => setTimings(e.target.value)}
        />
        <Input
          className="max-w-80 my-2"
          name="registration_number"
          value={regNo}
          type="text"
          label="Registration Number"
          placeholder=""
          onChange={(e) => setRegNo(e.target.value)}
        />
        <Textarea
          label="Description"
          onChange={(e) => setDesc(e.target.value)}
          value={desc}
          placeholder="Enter a short description of your clinic"
          className="max-w-90 my-2"
        />
        <Input
          disabled={!manualAddress}
          className="w-full my-2"
          name="address"
          value={address}
          type="text"
          label="Address"
          placeholder="Provided by Google"
          onChange={(e) => setAddress(e.target.value)}
        />
        <Button
        color="primary"
        variant="flat"
        onClick={() => setManualAddress(true)}
        >
          Enter Address Manually
        </Button>
      </div>
      <div className="w-full md:w-1/2 text-center">
        {manualAddress ? (
          <p className="w-full text-center text-xl font-semibold">Please enter full address in the form</p>
        ):(
          <GoogleMap onAddressSelect={handleAddressChange} />
        )
        }
      </div>
      <div className="flex w-full justify-center items-center p-2">
        <Button color="secondary" variant="flat" onPress={handleSubmit} isDisabled={loading}>
          {loading ? "Loading":"Submit"}
        </Button>
      </div>
    </main>
  );
}