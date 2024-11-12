// import React from "react";
import styles from "./Home2.module.css";
// import Lottie from "react-lottie";
import animation1 from "../../Content/Lottie/Animation - 1725085639361.json";
import animation2 from "../../Content/Lottie/Animation - 1725086452498 (1).json";
import animation3 from "../../Content/Lottie/Animation - 1725086730999.json";
import animation4 from "../../Content/Lottie/developer-discussing-different-options.json";
import LottieAnimation from "../Common/LottieAnimation";
const Home2 = () => {
  return (
    <div className="bg-secondary text-white"
    // style={{color:"whi te"}}
    >
      <main>
        {/* Section 1 */}
        <section className={styles.section}>
          <div className={`${styles.content} ${styles.blink}`}>
            <div className="flex flex-col sm:pt-[15vh] md:flex-row my-auto overflow-auto justify-center items-center p-4 space-y-4 md:space-y-0 md:space-x-4">
              <LottieAnimation
                path={animation2}
                className="flex-shrink-0 w-full md:w-1/2 lg:w-1/3"
              />
              <div className="flex  flex-col sm:text-lg justify-center items-center text-center md:text-left w-full md:w-1/2 lg:w-2/3">
                <p>
                  Create a productive study environment with our real-time room
                  creation feature. Share your{" "}
                  <div className="font-bold inline text-clip">
                    study routines live, track progress, and stay motivated with
                    community support.
                  </div>
                  {/* </p>
                <p> */}
                  Customize your study room, set goals, and let others join or
                  observe as you work towards success.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2 */}
        <section className={styles.section}>
          <div className={`${styles.content} ${styles.blink}`}>
          <div className="flex flex-col sm:pt-[15vh] md:flex-row my-auto overflow-auto justify-center items-center p-4 space-y-4 md:space-y-0 md:space-x-4">              <LottieAnimation
                path={animation3}
                className="flex-shrink-0 w-full md:w-1/2 lg:w-1/3"
              />
              <div className="flex flex-col sm:text-lg justify-center items-center text-center md:text-left w-full md:w-1/2 lg:w-2/3">
              <p>
                  Stay on top of your productivity with our{" "}
                  <div className="font-bold inline text-clip">
                    smart task management feature
                  </div>
                  . Write down your daily tasks, and our
                  <div className="font-bold inline text-clip">
                    {" "}
                    AI-powered system will automatically classify them as
                    productive or unproductive
                  </div>
                  , helping you track your progress. Get insights into how you
                  spend your time and make every day more efficient.
                  {/* </p>
                <p> */}
                  {/* We create a normal <code>@keyframe</code> animation to our
                  liking to transition between them. Check the navigation menu
                  to see different effects. */}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <div className={`${styles.content} ${styles.blink}`}>
          <div className="flex flex-col sm:pt-[15vh] md:flex-row my-auto overflow-auto justify-center items-center p-4 space-y-4 md:space-y-0 md:space-x-4">               <LottieAnimation
                path={animation4}
                className="flex-shrink-0 w-full md:w-1/2 lg:w-1/3"
              />
              <div className="flex flex-col sm:text-lg justify-center items-center text-center md:text-left w-full md:w-1/2 lg:w-2/3">
              <p>
                  Connect and share your coding journey by adding your
                  <div className="font-bold inline text-clip">
                    {" "}
                    LeetCode and GitHub profiles. Showcase your problem-solving
                    skills, track your coding progress
                  </div>
                  , and let others learn from your development projects. By
                  integrating these platforms, you can inspire and collaborate
                  with like-minded users in the community.
                  {/* </p>
                <p> */}
                  {/* We create a normal <code>@keyframe</code> animation to our
                  liking to transition between them. Check the navigation menu
                  to see different effects. */}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 4 */}
        <section className={styles.section}>
          <div className={`${styles.content} ${styles.blink}`}>
          <div className="flex flex-col sm:pt-[15vh] md:flex-row my-auto overflow-auto justify-center items-center p-4 space-y-4 md:space-y-0 md:space-x-4">           <LottieAnimation
                path={animation1}
                className="flex-shrink-0 w-full md:w-1/2 lg:w-1/3"
              />
              <div className="flex flex-col sm:text-lg justify-center items-center text-center md:text-left w-full md:w-1/2 lg:w-2/3">
              <p>
                  Enhance your focus by adding <div className="font-bold inline text-clip"> videos and playlists
                  directly to our dedicated study section.</div> Curate your study
                  materials in one place, avoiding the distractions of YouTube.
                  Share your favorite educational content with the community,
                  and create a streamlined learning experience that keeps you on
                  track.
                {/* </p>
                <p>
                  We create a normal <code>@keyframe</code> animation to our
                  liking to transition between them. Check the navigation menu
                  to see different effects. */}
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Home2;
