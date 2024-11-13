const { generateToken } = require("../../Utils/jwt.js");
const User = require("../Models/User.model.js");
const { format } = require("date-fns");
const cheerio = require("cheerio");
const _ = require("lodash");

const COLOR_MAP = {
  0: "#ebedf0",
  1: "#9be9a8",
  2: "#40c463",
  3: "#30a14e",
  4: "#216e39",
};
const UserController = {
  registerUser: async (req, res) => {
    try {
      const { name, email, password, leetcode, github,avatar } = req.body;
      const existingUser = await User.findOne({ email: email });
      if (existingUser) {
        // console.log("user Already registered");
        return res.status(409).json({ error: "user Already Exists" });
      }
      const newUser = new User({
        name,
        email,
        password,
        LeetCodeProfileName: leetcode,
        GitHubProfileName: github,
        avatar:avatar
      });
      await newUser.save();
      res.status(201).json(newUser);
    } catch (err) {
      console.log("Error in register user:", err);
    }
  },
  loginUser: async (req, res) => {
    try {
      const { email, password } = req.body;
      const existingUser = await User.findOne({ email: email });
      if (!existingUser) {
        return res.status(409).json({ error: "user is not Registered!" });
      }
      const isPasswordCorrect = await existingUser.isPasswordCorrect(password);
      if (!isPasswordCorrect) {
        return res.status(403).json({ error: "Incorrect Password" });
      }
      const payload = {
        email: existingUser.email,
        
      };

      const token = generateToken(payload);
      return res.json({
        token,
        userData: {name:existingUser.name,id:existingUser._id,avatar:existingUser.avatar},
        // id: existingUser._id,
      });
    } catch (err) {
      console.log("Error:", err);
    }
  },
  getUser: async (req, res) => {
    try {
      const {name}=req.params;
      const data = await User.findOne({name:name}).select('-_id');
      if(!data){
        return res.status(404).json({error:"User not found!"})
      }

      // console.log("data",data);
      res.status(200).json(data);
    } catch (err) {
      console.log(err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },
  visitUser: async (req, res) => {
    try {
      const { id } = req.params;
      const currentDate = format(Date.now(), "d/M/yyyy");
      const user = await User.findById(id);

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      const heatmapEntry = user.HeatMap.find(
        (entry) => format(entry.date, "d/M/yyyy") === currentDate
      );

      if (heatmapEntry) {
        heatmapEntry.count += 1;
      } else {
        user.HeatMap.push({
          date: currentDate,
          count: 1,
        });
      }
      await user.save();

      return res.status(200).json({ message: "Heatmap updated successfully" });
    } catch (err) {
      console.error(err);
    }
  },
  fetchYears: async (req, res) => {
    try {
      const { username } = req.body;
  
      // Fetch the GitHub profile page
      const response = await fetch(
        `https://github.com/${username}?tab=contributions`,
        {
          headers: {
            "x-requested-with": "XMLHttpRequest",
          },
        }
      );
      console.log(response);
      
      // Check if the request was successful
      if (!response.ok) {
        return res.status(response.status).json({ error: "Failed to fetch data" });
      }
  
      // Parse the response
      const body = await response.text();
      const $ = cheerio.load(body);
  
      // Extract contribution year links
      const years = $(".js-year-link")
        .get()
        .map((a) => {
          const $a = $(a);
          const href = $a.attr("href");
  
          // Construct a formatted URL with the 'contributions' tab
          const githubUrl = new URL(`https://github.com${href}`);
          githubUrl.searchParams.set("tab", "contributions");
  
          return {
            href: `${githubUrl.pathname}${githubUrl.search}`,
            text: $a.text().trim(),
          };
        });
  
      // Return the list of years
      return res.json(years);
    } catch (error) {
      return res.status(500).json({ error: "Internal server error", details: error.message });
    }
  },

  fetchDataForYear: async (req, res) => {
    try {
      const { url, year, format } = req.body;
      console.log(url, year, format);
      
      const response = await fetch(`https://github.com${url}`, {
        headers: {
          "x-requested-with": "XMLHttpRequest",
        },
      });
  
      if (!response.ok) {
        return res.status(response.status).json({ error: "Failed to fetch data" });
      }
  
      const data = await response.text();
      const $ = cheerio.load(data);
      const $days = $("table.ContributionCalendar-grid td.ContributionCalendar-day");
  
      const contribText = $(".js-yearly-contributions h2")
        .text()
        .trim()
        .match(/^([0-9,]+)\s/);
  
      let contribCount = contribText ? parseInt(contribText[1].replace(/,/g, ""), 10) : 0;
  
      const contributions = (() => {
        const parseDay = (day, index) => {
          const $day = $(day);
          const date = $day.attr("data-date");
          const color = COLOR_MAP[$day.attr("data-level")];
          return {
            date,
            count: index === 0 ? contribCount : 0,
            color,
            intensity: $day.attr("data-level") || 0,
          };
        };
  
        if (format !== "nested") {
          return $days.get().map((day, index) => parseDay(day, index));
        }
  
        return $days.get().reduce((nested, day, index) => {
          const parsedDay = parseDay(day, index);
          const [year, month, dayOfMonth] = parsedDay.date.split("-").map(Number);
  
          if (!nested[year]) nested[year] = {};
          if (!nested[year][month]) nested[year][month] = {};
          nested[year][month][dayOfMonth] = parsedDay;
  
          return nested;
        }, {});
      })();
  
      return res.json({
        year,
        total: contribCount,
        range: {
          start: $($days[0]).attr("data-date"),
          end: $($days[$days.length - 1]).attr("data-date"),
        },
        contributions,
      });
    } catch (error) {
      console.log(error);
      
      return res.status(500).json({ error: "Internal server error", details: error.message });
    }
  },
  fetchDataForAllYears: async (req, res) => {
    try {
      const { username, format } = req.body;
      const years = await fetchYears(username); // Assuming fetchYears is defined elsewhere
  
      const allYearData = await Promise.all(
        years.map(({ href, text: year }) => fetchDataForYear({ body: { url: href, year, format } }, res))
      );
  
      const contributions = format === "nested"
        ? allYearData.reduce((acc, curr) => _.merge(acc, curr.contributions), {})
        : allYearData
            .flatMap((yearData) => yearData.contributions)
            .sort((a, b) => new Date(b.date) - new Date(a.date));
  
      const yearsData = format === "nested"
        ? allYearData.reduce((obj, yearData) => {
            const { contributions, ...rest } = yearData;
            _.setWith(obj, [rest.year], rest, Object);
            return obj;
          }, {})
        : allYearData.map(({ contributions, ...rest }) => rest);
  
      return res.json({
        years: yearsData,
        contributions,
      });
    } catch (error) {
      return res.status(500).json({ error: "Internal server error", details: error.message });
    }
  },
  addSkill:async (req,res)=>{
    try{
      const {id}=req.params;
      const {skill}=req.body;
      console.log(id);
      const user=await User.findById(id);
      if(!user){
        return res.status(404).json({error:"User not found"});
        }
        const updatedData=await User.findByIdAndUpdate(id,{$addToSet: {skills:skill}});
        return res.json({message:"Skill added successfully",
          skill:updatedData?.skills
        });
      }
      catch(err){
        console.error(err);
        return res.status(500).json({error:"Internal server error",details:err.message});
      }

  }
};
module.exports = UserController;
