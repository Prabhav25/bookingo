"use client";
import React, { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Formik } from "formik";
import { Button } from "@/components/ui/button";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "@/utils/supabase/client";
import { toast } from "sonner";
import { useUser } from "@clerk/nextjs";
import FileUpload from "../_components/FileUpload";
import { Loader } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

function EditListing({ params }) {
  const { user } = useUser(); //to get user information
  const router = useRouter();
  const [listing, setListing] = useState([]);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false); //initial set to false
  useEffect(() => {
    user && verifyUserRecord(); //we call this method whenever user inforation is available
  });

  const verifyUserRecord = async () => {
    //fetching user record so if user tries to updat the record or record id that is not present in the table then it will tale us to home page
    const { data, error } = await supabase
      .from("listing") //table name
      .select("*,listingImages(listing_id,url)") //to fetch already uploaded images by same user when he refills form
      .eq("createdBy", user?.primaryEmailAddress.emailAddress)
      .eq("id", params.id); //condition that needs to be updated

    if (data) {
      //if data is available we can store that data and save the default value inside the form
      setListing(data[0]);
    }

    if (data?.length <= 0) {
      router.replace("/");
    }
  };

  const onSubmitHandler = async (formValue) => {
    setLoading(true); //whenever user clicks on publish
    //see supabase update rows code from supabase API docs
    const { data, error } = await supabase
      .from("listing") // table name
      .update(formValue) //complete formvalue having field and its value
      .eq("id", params.id) //as in structure e have dynamic path in folder we have created inside [id] so we can pass params in function and use it here as params.id
      .select(); //once updated it will return the value

    if (data) {
      console.log(data);
      toast("Listing updated and published");
      setLoading(false);
    }

    //to upload ans tore the images inside supabase database
    for (const image of images) {
      setLoading(true);
      const file = image; //storing each image in file
      const fileName = Date.now().toString(); //to create a unique string everytime, Date.now() returns a number when method is called and toString() converts it into a string
      const fileExt = fileName.split(".").pop(); //it will split into array of strings and pop the last array for example in photo.jpeg it will give jpeg

      //to store the value, listingImages is bucket name we created in supabase website
      const { data, error } = await supabase.storage
        .from("listingImages")
        .upload(`${fileName}`, file, {
          contentType: `image/${fileExt}`,
          upsert: false, //as we don't want to update any existing file
        });

      if (error) {
        setLoading(false);
        toast("Error while uploading images");
      } else {
        const imageUrl = process.env.NEXT_PUBLIC_IMAGE_URL + fileName; //generating imageURL

        //storing images url in listingImages table
        const { data, error } = await supabase
          .from("listingImages")
          .insert([{ url: imageUrl, listing_id: params?.id }])
          .select();
        if (error) {
          setLoading(false);
        }
      }
      setLoading(false); //when everything goes fine
    }
  };

  const publishBtnHandler = async () => {
    setLoading(true);
    // to update rows
    const { data, error } = await supabase
      .from("listing")
      .update({ active: true })
      .eq("id", params?.id)
      .select();

    if (data) {
      setLoading(false);
      toast("Listing Published!");
    }
  };

  return (
    <div className="px-10 md:px-36 my-10">
      <h2 className="font-bold text-2xl">
        Enter some more details about your listing
      </h2>
      <Formik
        initialValues={{
          //when we update the information at that time we can provide the intial values
          type: "",
          propertyType: "",
          profileImage: user?.imageUrl,
          fullName: user?.fullName,
        }}
        onSubmit={(values) => {
          console.log(values); //consol the values on submit
          onSubmitHandler(values);
        }}
      >
        {({ values, handleChange, handleSubmit }) => (
          <form onSubmit={handleSubmit}>
            <div className="p-8 rounded-lg shadow-md flex flex-col gap-5">
              <div className="grid grid-cols-3 mg:grid-cols-3 gap-10">
                <div className="flex flex-col gap-2">
                  <h2 className="text-lg text-slate-500">Rent or Sell?</h2>
                  {/* v is the event object that stores the value  */}
                  <RadioGroup
                    name="type"
                    onValueChange={(v) => (values.type = v)}
                    defaultValue={listing?.type}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Rent" id="Rent" />
                      <Label htmlFor="Rent">Rent</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Sell" id="Sell" />
                      <Label htmlFor="Sell">Sell</Label>
                    </div>
                  </RadioGroup>
                </div>
                <div className="flex flex-col gap-2">
                  <h2 className="text-lg text-slate-500">Property Type</h2>
                  <Select
                    onValueChange={(e) => (values.propertyType = e)}
                    name="propertyType" //event object e stores the propertyType values
                    defaultValue={listing?.propertyType}
                  >
                    {/* it has onValueChange in shadcn */}
                    <SelectTrigger className="w-[190px]">
                      <SelectValue
                        placeholder={
                          listing?.propertyType
                            ? listing?.propertyType
                            : "Select Property Type"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Single Family House">
                        Single Family House
                      </SelectItem>
                      <SelectItem value="Town House">Town House</SelectItem>
                      <SelectItem value="Condo">Condo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                <div className="flex gap-2 flex-col">
                  <h2 className="text-gray-500">Bedroom</h2>
                  {/* input has inputChange according to formik doc */}
                  <Input
                    type="number"
                    placeholder="Ex.2"
                    defaultValue={listing?.bedroom} //if a user islogged in and already has some record stored then on editing by default the same record will be shown in fields
                    onChange={handleChange}
                    name="bedroom" //name depends on the name we have added in supabase website database
                  />
                </div>
                <div className="flex gap-2 flex-col">
                  <h2 className="text-gray-500">Bathroom</h2>
                  <Input
                    type="number"
                    placeholder="Ex.2"
                    defaultValue={listing?.bathroom}
                    onChange={handleChange}
                    name="bathroom"
                  />
                </div>
                <div className="flex gap-2 flex-col">
                  <h2 className="text-gray-500">Built In</h2>
                  <Input
                    type="number"
                    placeholder="Ex.1900 Sq.ft"
                    defaultValue={listing?.builtIn}
                    name="builtIn"
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                <div className="flex gap-2 flex-col">
                  <h2 className="text-gray-500">Parking</h2>
                  <Input
                    type="number"
                    placeholder="Ex.2"
                    defaultValue={listing?.parking}
                    onChange={handleChange}
                    name="parking"
                  />
                </div>
                <div className="flex gap-2 flex-col">
                  <h2 className="text-gray-500">Lot Size (Sq.Ft)</h2>
                  <Input
                    type="number"
                    placeholder=""
                    defaultValue={listing?.lotSize}
                    onChange={handleChange}
                    name="lotSize"
                  />
                </div>
                <div className="flex gap-2 flex-col">
                  <h2 className="text-gray-500">Area (Sq.Ft)</h2>
                  <Input
                    type="number"
                    placeholder="Ex.1900"
                    defaultValue={listing?.area}
                    onChange={handleChange}
                    name="area"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                <div className="flex gap-2 flex-col">
                  <h2 className="text-gray-500">Selling Price ($)</h2>
                  <Input
                    type="number"
                    placeholder="400000"
                    defaultValue={listing?.price}
                    onChange={handleChange}
                    name="price"
                  />
                </div>
                <div className="flex gap-2 flex-col">
                  <h2 className="text-gray-500">HOA (Per Month) ($)</h2>
                  <Input
                    type="number"
                    placeholder="100"
                    defaultValue={listing?.hoa}
                    onChange={handleChange}
                    name="hoa"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 gap-10">
                <div className="flex gap-2 flex-col">
                  <h2 className="text-gray-500">Description</h2>
                  <Textarea
                    placeholder=""
                    defaultValue={listing?.description}
                    onChange={handleChange}
                    name="description"
                  />
                </div>
              </div>
              <div>
                <h2 className="font-lg text-gray-500 my-2">
                  Upload Property Images
                </h2>
                <FileUpload
                  setImages={(value) => setImages(value)}
                  imageList={listing.listing_images}
                />
              </div>
              <div className="flex gap-3 justify-end">
                <Button
                  variant="outline"
                  disabled={loading}
                  className="text-primary border-orimary"
                >
                  {loading ? <Loader className="animate-spin" /> : "Save"}
                </Button>

                {/* to set alert while publishing and setting active status to true */}
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button type="button" disabled={loading} className="">
                      {loading ? (
                        <Loader className="animate-spin" />
                      ) : (
                        "Save & Publish"
                      )}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Ready to Publish?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Do you really want to publish the listing?
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => publishBtnHandler()}>
                        {loading ? (
                          <Loader className="animate-spin" />
                        ) : (
                          "Continue"
                        )}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </form>
        )}
      </Formik>
    </div>
  );
}

export default EditListing;
