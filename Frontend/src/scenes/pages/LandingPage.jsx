import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "../../styles/landingPage.css";
import Footer from "../../component/footer";

function LandingPage() {
  const [styles, setStyles] = useState([]);
  const [categories, setCategories] = useState([]);

  const [formData, setFormData] = useState({
    headerImage: "",
    logoImage: null,
    descriptions: ["", "", ""],
    colors: ["", ""],
    mapsLink: "",
    instagram: "",
  });
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://static.elfsight.com/platform/platform.js";
    script.async = true;
    script.onload = () => {
      console.log("Elfsight widget script loaded");
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);
  useEffect(() => {
    const fetchStyles = async () => {
      try {
        const response = await fetch(
          "https://madonna-backend.onrender.com/api/styles/get"
        );
        const data = await response.json();
        if (response.ok) {
          setStyles(data);
          console.log("Fetched Styles:", data);

          if (data.length > 0) {
            const style = data[0];
            setFormData({
              headerImage: style.headerImage,
              logoImage: style.logoImage,
              descriptions: style.descriptions || ["", "", ""],
              colors: style.colors || ["", ""],
              mapsLink: style.mapsLink || "",
              instagram: style.instagram || "",
            });
          }
        } else {
          toast.error("Failed to fetch styles.");
        }
      } catch (error) {
        console.error("Error fetching styles:", error);
        toast.error("An error occurred while fetching styles.");
      }
    };

    fetchStyles();
  }, []);
  useEffect(() => {
    // Fetch categories on component mount
    const fetchCategories = async () => {
      try {
        const response = await fetch(
          "https://madonna-backend.onrender.com/api/categories/get"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch categories");
        }
        const data = await response.json();
        setCategories(data.categories); // Extract the array of categories
        console.log("Fetched categories:", data.categories); // Log the extracted categories array
      } catch (error) {
        console.error("Error fetching categories:", error);
        toast.error("Failed to fetch categories. Please try again.");
      }
    };

    fetchCategories();
  }, []);
  const responsive = {
    desktop: {
      breakpoint: { max: 3000, min: 1081 },
      items: 3,
      slidesToSlide: 3, // optional, default to 1.
    },
    tablet: {
      breakpoint: { max: 1024, min: 731 },
      items: 2,
      slidesToSlide: 2, // optional, default to 1.
    },
    mobile: {
      breakpoint: { max: 730, min: 0 },
      items: 1,
      slidesToSlide: 1, // optional, default to 1.
    },
  };

  // Framer Motion Variants
  const servicesVariant = {
    offscreen: { opacity: 0 },
    onscreen: {
      opacity: 1,
      transition: { type: "tween", duration: 1 },
    },
  };

  const modelVariant = {
    offscreen: { x: -100, opacity: 0 },
    onscreen: {
      x: 0,
      opacity: 1,
      transition: { type: "tween", duration: 1 },
    },
  };

  const textVariant = {
    offscreen: { x: -100, opacity: 0 },
    onscreen: {
      x: 0,
      opacity: 1,
      transition: { type: "tween", duration: 1, delay: 0.8 },
    },
  };

  const fourthhButton = {
    offscreen: { x: -100, opacity: 0 },
    onscreen: {
      x: 0,
      opacity: 1,
      transition: { type: "tween", duration: 1, delay: 0.8 },
    },
  };

  const fourthButton = {
    offscreen: { x: 0, opacity: 0 },
    onscreen: {
      x: 0,
      y: -70,
      opacity: 1,
      transition: { type: "tween", duration: 1 },
    },
  };

  const fourthhText = {
    offscreen: { y: 150, opacity: 0 },
    onscreen: {
      x: 0,
      y: 0,
      opacity: 1,
      transition: { type: "tween", duration: 1, delay: 0.8 },
    },
  };

  const fourthText = {
    offscreen: { x: -200, y: 80, opacity: 0 },
    onscreen: {
      x: 0,
      y: 80,
      opacity: 1,
      transition: { type: "tween", duration: 1.2 },
    },
  };

  return (
    <div className="h-full w-full overflow-x-hidden">
      <div className="mt-[60px] block h-[600px] w-full fifth:hidden">
        {/* ---------fifth < 545 viewport----------- */}
        <div
          className="relative z-[-1] h-[85%] w-full"
          style={{
            backgroundImage: `url(${formData.headerImage.url})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="flex flex-col justify-between border border-black">
            <div className="transfrom flex w-full gap-5">
              <motion.p
                className="absolute bottom-5 right-5 flex h-[100px] max-w-[200px] min-w-[120px] flex-col items-center justify-center rounded-lg border-[7px] border-white bg-[#F98866] p-2 text-end"
                variants={fourthText}
                initial="offscreen"
                whileInView="onscreen"
                viewport={{ once: true }}
              >
                <p>{formData.descriptions[0]}</p>
              </motion.p>
              <motion.button
                className="absolute bottom-0 right-5 flex w-1/2 items-center justify-end gap-2 text-end text-white"
                variants={fourthButton}
                initial="offscreen"
                whileInView="onscreen"
                viewport={{ once: true }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="size-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6.75 15.75 3 12m0 0 3.75-3.75M3 12h18"
                  />
                </svg>
                <Link to="/services">BOOK NOW</Link>
              </motion.button>
            </div>
          </div>
        </div>
        {/* ---------fifth < 545 viewport----------- */}
      </div>

      {/* ---------fourth <546 viewport----------- */}
      <div className="z-[-1] hidden fifthh:relative fifthh:mt-[30px] fifthh:flex fifthh:h-[700px] fifthh:w-full fifthh:items-center fifthh:text-center fourthh:hidden">
        <>
          <motion.img
            variants={modelVariant}
            initial="offscreen"
            whileInView="onscreen"
            viewport={{ once: true }}
            src={formData.headerImage.url}
            alt="Beautiful girl"
            className="z-[-1] mx-auto h-[90%] max-h-full w-[90%] max-w-full object-cover"
            style={{
              borderBottomLeftRadius: "15px 255px",
              borderBottomRightRadius: "225px 15px",
              borderTopLeftRadius: "255px 15px",
              borderTopRightRadius: "15px 225px",
              maxWidth: "100%",
            }}
          />
          <div className="absolute bottom-[10%] flex h-[20%] w-full items-center justify-between px-5">
            <motion.button
              className="mx-10 flex gap-2 text-white"
              variants={fourthhButton}
              initial="offscreen"
              whileInView="onscreen"
              viewport={{ once: true }}
            >
              {" "}
              <Link to="/services">BOOK NOW</Link>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3"
                />
              </svg>
            </motion.button>
            <motion.div
              className={`z-[-1] mr-10 flex h-[70%] w-[40%] flex-col justify-center border-4 border-white text-center`}
              variants={fourthhText}
              initial="offscreen"
              whileInView="onscreen"
              viewport={{ once: true }}
              style={{
                backgroundColor: formData.colors[0],
                borderBottomLeftRadius: "255px 15px ",
                borderBottomRightRadius: " 15px 225px",
                borderTopLeftRadius: "255px 15px",
                borderTopRightRadius: " 225px 15px",
                maxWidth: "100%",
              }}
            >
              <p className="px-5 text-end">
                <p>{formData.descriptions[1]}</p>
              </p>
            </motion.div>
          </div>
          <div
            className={`absolute left-1/2 top-1/2 z-[-5] h-[90%] w-[90%] -translate-x-[48%] -translate-y-[48%] `}
            style={{
              backgroundColor: formData.colors[0],
              borderBottomLeftRadius: "15px 255px",
              borderBottomRightRadius: "225px 15px",
              borderTopLeftRadius: "255px 15px",
              borderTopRightRadius: "15px 225px",
              maxWidth: "100%",
            }}
          ></div>
        </>
      </div>
      {/* ---------fouAAArth <546 viewport----------- */}

      <div className="hidden fourthh:relative fourthh:flex fourthh:h-full fourthh:w-full">
        <>
          <motion.div
            className="z-[-1] m-auto mt-[130px] h-[78%] w-[80%] -translate-x-[3%] transform overflow-hidden"
            style={{
              borderBottomLeftRadius: "15px 255px",
              borderBottomRightRadius: "225px 15px",
              borderTopLeftRadius: "255px 15px",
              borderTopRightRadius: "15px 225px",
              maxWidth: "100%",
            }}
            variants={modelVariant}
            initial="offscreen"
            whileInView="onscreen"
            viewport={{ once: true }}
          >
            <img
              src={formData.headerImage.url}
              alt="Beautiful Girl"
              className="h-full w-full object-cover"
            />
          </motion.div>
          <motion.div
            variants={textVariant}
            initial="offscreen"
            whileInView="onscreen"
            viewport={{ once: true }}
            className="max-h-[300px] min-h-[200px] absolute bottom-10 right-5  flex h-[250px] w-[400px] flex-col border-[10px] border-white bg-[#b19f6e] p-2 text-[25px]"
          >
            <div className="mt-1 ">
              <p>{formData.descriptions[0]}</p>
            </div>
            <button className="flex h-[50px] items-center justify-end gap-2 p-2 cursor-pointer -translate-y-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6.75 15.75 3 12m0 0 3.75-3.75M3 12h18"
                />
              </svg>
              <Link to="/services">BOOK NOW</Link>
            </button>
          </motion.div>
          <div
            className="absolute right-0 top-0 z-[-2] h-full w-1/2 "
            style={{ backgroundColor: formData.colors[0] }}
          ></div>
        </>
      </div>
      <div className="relative w-full z-[-1]">
        <motion.div
          className="absolute right-5 top-2 z-[15] flex h-[60px] w-[300px] items-center"
          variants={servicesVariant}
          initial="offscreen"
          whileInView="onscreen"
          viewport={{ once: true, amount: 1 }}
        >
          <svg width="100%">
            <text x="50%" y="60%" className="">
              SERVICES
            </text>
          </svg>
        </motion.div>
        <Carousel
          responsive={responsive}
          infinite={true}
          slidesToShow={1}
          showDots={false}
          containerClass="carousel-container"
          itemClass={"carouselItem"}
          autoPlay={true}
          arrows={false}
          autoPlaySpeed={3500}
          partialVisible={false}
          className="w-full gap-2"
        >
          {categories.map((category, index) => (
            <div
              key={index}
              className="flex h-[600px] w-full flex-col items-center justify-center rounded-md bg-[#fcdebe]"
            >
              <img
                src={category.serviceFile.url}
                alt={category.serviceCategory}
                className="mt-2 h-[460px] w-[98%] border border-black object-cover rounded-md"
              />
              <div className="h-[130px] w-full p-3">
                <section className="flex justify-between">
                  <h1> {category.serviceCategory}</h1>
                </section>
                <section className="w-full">
                  <p> {category.serviceDescription}</p>
                </section>
              </div>
            </div>
          ))}
        </Carousel>
      </div>
      <div className="flex w-full flex-col mt-[-40px]  overflow-y-hidden">
        <section className="flex h-[70px] transform translate-y-[56px] w-full items-center justify-center text-center text-[50px] italic">
          FOLLOW US
        </section>
        <div className="relative transform translate-y-[56px]">
          <div
            className={` ${formData.instagram}`}
            data-elfsight-app-lazy
          ></div>
        </div>
      </div>
      <div className="w-full flex flex-col gap-2 z-[-1]">
        <h1 className="text-[40px] mt-5 third:text-[50px] text-center">
          Where to find us:
        </h1>
        <iframe
          src={formData.mapsLink}
          style={{ border: "0" }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Google Map Location"
          className="w-full h-[400px]"
        ></iframe>
      </div>
      <Footer />
    </div>
  );
}

export default LandingPage;
