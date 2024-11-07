import { useEffect } from "react";
import { motion } from "framer-motion";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

// Import assets
import model from "../../assets/model.jpg";
import "../../styles/landingPage.css";

function LandingPage() {
  useEffect(() => {
    // This ensures that the widget script has loaded before using it.
    const script = document.createElement("script");
    script.src = "https://static.elfsight.com/platform/platform.js";
    script.async = true;
    script.onload = () => {
      console.log("Elfsight widget script loaded");
    };
    document.body.appendChild(script);

    // Cleanup the script tag when the component unmounts
    return () => {
      document.body.removeChild(script);
    };
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

  const CustomDot = ({ onClick, active }) => {
    return (
      <li style={{ margin: "0 5px 15px 0px" }}>
        <button
          style={{
            background: active ? "black" : "#b19f6e",
            border: "1px solid white",
            borderRadius: "50%",
            width: "12px",
            height: "12px",
            cursor: "pointer",
            outline: "none",
          }}
          onClick={onClick}
        />
      </li>
    );
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
    offscreen: { x: -500, y: 80, opacity: 0 },
    onscreen: {
      x: 0,
      y: 80,
      opacity: 1,
      transition: { type: "tween", duration: 1.2 },
    },
  };

  return (
    <div className="h-full w-full overflow-x-hidden">
      <div className="mt-[120px] block h-[600px] w-full fifth:hidden">
        {/* ---------fifth < 545 viewport----------- */}
        <div
          className="relative z-[-1] h-[85%] w-full"
          style={{
            backgroundImage: `url(${model})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="flex flex-col justify-between border border-black">
            <div className="transfrom flex w-full gap-5">
              <motion.p
                className="absolute bottom-5 right-5 flex h-[100px] max-w-[200px] flex-col items-center justify-center rounded-lg border-[7px] border-white bg-[#fcdebe] p-2 text-end"
                variants={fourthText}
                initial="offscreen"
                whileInView="onscreen"
                viewport={{ once: true }}
              >
                Helping You Feel Comfortable in Your Skin.
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
                <p>BOOK NOW</p>
              </motion.button>
            </div>
          </div>
        </div>
        {/* ---------fifth < 545 viewport----------- */}
      </div>

      {/* ---------fourth <546 viewport----------- */}
      <div className="z-[-1] hidden fifthh:relative fifthh:mt-[90px] fifthh:flex fifthh:h-[700px] fifthh:w-full fifthh:items-center fifthh:text-center fourthh:hidden">
        <>
          <motion.img
            variants={modelVariant}
            initial="offscreen"
            whileInView="onscreen"
            viewport={{ once: true }}
            src={model}
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
              <p>BOOK NOW</p>
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
              className="z-[-1] mr-10 flex h-[70%] w-[40%] flex-col justify-center border-4 border-white bg-[#fcdebe] text-center"
              variants={fourthhText}
              initial="offscreen"
              whileInView="onscreen"
              viewport={{ once: true }}
              style={{
                borderBottomLeftRadius: "255px 15px ",
                borderBottomRightRadius: " 15px 225px",
                borderTopLeftRadius: "255px 15px",
                borderTopRightRadius: " 225px 15px",
                maxWidth: "100%",
              }}
            >
              <p className="px-5 text-end">
                skincare is more than just a routine.
              </p>
              <p className="px-5 text-end">it's a self-care ritual</p>
            </motion.div>
          </div>
          <div
            className="absolute left-1/2 top-1/2 z-[-5] h-[90%] w-[90%] -translate-x-[48%] -translate-y-[48%] bg-[#fcdebe]"
            style={{
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
              src={model}
              alt="Beautiful Girl"
              className="h-full w-full object-cover"
            />
          </motion.div>
          <motion.div
            variants={textVariant}
            initial="offscreen"
            whileInView="onscreen"
            viewport={{ once: true }}
            className="absolute bottom-10 right-5 z-[-1] flex h-[30%] w-[400px] flex-col border-[10px] border-white bg-[#b19f6e] p-2 text-[25px]"
          >
            <div className="mt-1">
              <p>Where Gentle Care Meets Radiant Results</p>
              <p>Because Every Skin Deserves to Shine!</p>
            </div>
            <button className="flex h-[50px] items-center justify-end gap-2 p-2">
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
              <p>BOOK NOW</p>
            </button>
          </motion.div>
          <div className="absolute right-0 top-0 z-[-2] h-full w-1/2 bg-[#fcdebe]"></div>
        </>
      </div>
      <div className="relative w-full">
        <motion.div
          className="absolute right-2 top-2 z-[15] flex h-[60px] w-[250px] items-center"
          variants={servicesVariant}
          initial="offscreen"
          whileInView="onscreen"
          viewport={{ once: true, amount: 1 }}
        >
          <svg width="100%">
            <text x="50%" y="60%">
              SERVICES
            </text>
          </svg>
        </motion.div>
        <Carousel
          responsive={responsive}
          infinite={true}
          showDots={true}
          customDot={<CustomDot onClick={() => {}} active={false} />}
          containerClass="carousel-container"
          dotListClass="custom-dot-list-style"
          itemClass={"carouselItem"}
          partialVisible={false}
          className="w-full gap-2"
        >
          <div className="flex h-[600px] w-full flex-col items-center justify-center bg-[#fcdebe]">
            <img
              src={model}
              className="mt-2 h-[460px] w-[95%] border border-black object-cover"
              alt=""
            />
            <div className="h-[130px] w-full p-3">
              <section className="flex justify-between">
                <h1>Title</h1>
                <h1>Price</h1>
              </section>
              <section className="w-full">
                <p>DESCRIPTION</p>
              </section>
            </div>
          </div>
          <div className="flex h-[600px] w-full flex-col items-center justify-center bg-[#fcdebe]">
            <img
              src={model}
              className="mt-2 h-[460px] w-[95%] border border-black object-cover"
              alt=""
            />
            <div className="h-[130px] w-full p-3">
              <section className="flex justify-between">
                <h1>Title</h1>
                <h1>Price</h1>
              </section>
              <section className="w-full">
                <p>DESCRIPTION</p>
              </section>
            </div>
          </div>
          <div className="flex h-[600px] w-full flex-col items-center justify-center bg-[#fcdebe]">
            <img
              src={model}
              className="mt-2 h-[460px] w-[95%] object-cover"
              alt=""
            />
            <div className="h-[130px] w-full p-3">
              <section className="flex justify-between">
                <h1>Title</h1>
                <h1>Price</h1>
              </section>
              <section className="w-full">
                <p>DESCRIPTION</p>
              </section>
            </div>
          </div>
          <div className="flex h-[600px] w-full flex-col items-center justify-center bg-[#fcdebe]">
            <img
              src={model}
              className="mt-2 h-[460px] w-[95%] border border-black object-cover"
              alt=""
            />
            <div className="h-[130px] w-full p-3">
              <section className="flex justify-between">
                <h1>Title</h1>
                <h1>Price</h1>
              </section>
              <section className="w-full">
                <p>DESCRIPTION</p>
              </section>
            </div>
          </div>
        </Carousel>
      </div>
      <div className="mt-10 flex w-full flex-col">
        <section className="flex h-[100px] w-full items-center justify-center text-center text-[50px] italic">
          FOLLOW US
        </section>
        <div className="relative">
          <div
            className="elfsight-app-26d554a1-d956-43a9-9808-7e72cceb14d3"
            data-elfsight-app-lazy
          ></div>
          <div className="absolute bottom-0 z-[100000000000000000] h-[50px] w-full bg-white"></div>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
