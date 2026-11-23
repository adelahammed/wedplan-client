"use client";
import React from "react";

const page = () => {
  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];

    const formData = new FormData();
    formData.append("image", file);

    const imgbbAPI = `https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMAGEBB_API}`;

    console.log("api", imgbbAPI);

    const res = await fetch(imgbbAPI, {
      method: "POST",
      body: formData,
    });
    const result = await res.json();

    console.log("response", result);
  };

  return (
    <div>
      <p>{process.env.NEXT_PUBLIC_IMAGEBB_API}</p>
      <form className="space-y-6">
        <label
          htmlFor="service-file-upload"
          className="inline-block cursor-pointer rounded-md bg-black px-4 py-2 text-white"
        >
          Upload
        </label>
        <input
          id="service-file-upload"
          name="service-file-upload"
          type="file"
          onChange={handleFileChange}
          className="sr-only"
        />
      </form>
    </div>
  );
};

export default page;
