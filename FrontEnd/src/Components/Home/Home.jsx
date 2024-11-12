// import React from 'react'
import LottieAnimation from "../Common/LottieAnimation"
import style from "./Home.module.css"
import Home2 from "./Home2";
import animation1 from "../../Content/Lottie/Animation - 1725210958916.json"
function Home() {
  return (<>
  
     <div className={`${style["content"]} bg-primary`}>
    <div className={style["container"]}>
      <div className={style["info"]}>
        <h1>Looking For Productive App</h1>
        <p>Which will focus on your development journey and help you to stay focus througout your daily life and with all the nessecary funtionality</p>
        <button>Get Started</button>
      </div>
      <div className={style["image"]}>
        <LottieAnimation path={animation1}/>
        {/* <img className={style["main-image"]} src="https://cdni.iconscout.com/illustration/premium/thumb/businessman-working-using-vr-tech-3840669-3202986.png?f=webp"/> */}
      </div>
    </div>
  </div>
  <Home2/>
  </>
  )
}

export default Home