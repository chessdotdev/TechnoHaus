import { Products } from "../models/products.model.js";
import { OpenAI } from "openai";
import 'dotenv/config';

const client = new OpenAI({
  baseURL: "https://router.huggingface.co/v1",
  apiKey: process.env.HF_API_KEY,
});

const generateBuild = async (req, res) => {
  try {
    const { budget, description } = req.body;
    const budgetNum = Number(budget);

    if (!budgetNum || !description) {
      return res.status(400).json({
        message: "Budget and description are required",
      });
    }

    if (isNaN(budgetNum)) {
      return res.status(400).json({
        message: "Budget must be a number",
      });
    }

    const pcKeywords = [
      'pc', 'build', 'gaming', 'game', 'render', 'rendering', 'edit', 'editing',
      'video', 'stream', 'streaming', 'office', 'work', 'workstation', 'budget',
      'performance', 'cpu', 'gpu', 'ram', 'processor', 'graphics', 'storage',
      'ssd', 'hdd', 'intel', 'amd', 'nvidia', 'ryzen', 'core', 'programming',
      'coding', 'design', '3d', 'animation', 'school', 'student', 'everyday',
      'fast', 'powerful', 'cheap', 'affordable', 'high-end', 'mid-range', 'low-end'
    ];

    const descLower = description.toLowerCase();
    const isRelevant = pcKeywords.some(kw => descLower.includes(kw));

    if (!isRelevant) {
      return res.status(400).json({
        message: "Description must be related to PC building (e.g. 'gaming PC', 'video editing workstation', 'budget office build').",
      });
    }


    const tolerance = 0.1;
    const maxPrice = budgetNum * (1 + tolerance);
    console.log("Max Price with Tolerance: ", maxPrice);

 
    const products = await Products.find({
      price: { $lte: maxPrice },
    }).select("_id CPU GPU RAM STORAGE CASE price image");


    if (!products.length) {
      return res.status(404).json({
        message: `No products available within your budget of ${budgetNum} PHP`,
      }); 
    }


    const prompt = `
        You are a PC build assistant for an e-commerce store.

        STRICT RULES:
        - ONLY use parts from the provided product list.
        - DO NOT invent parts.
        - DO NOT modify part names.
        - If a valid build is not possible, return null values.
        - If the description is unrelated, informal, unclear, or not in English or Tagalog, return all values as null.
        USER REQUIREMENTS:
        - Budget: ${budgetNum} PHP.
        - Description: ${description}.

        AVAILABLE PRODUCTS (JSON):
        ${JSON.stringify(products, null, 2)}

        TASK:
        1. Analyze the description and choose the best matching build.
        2. The build should fit within the given budget of ${budgetNum} PHP and **should not exceed the budget by more than 10%**.
        3. If no build fits, return all values as null.
        4. If multiple builds are equally close to the budget, choose the one with the **best overall performance**.
        5. If the description mentions a **preferred brand** (like "NVIDIA GPU", "Intel CPU", "AMD CPU", "Corsair RAM"), prioritize products that match that brand preference.
        6. Make sure to prioritize the **most appropriate components** based on the description (e.g., "Good for gaming" should prioritize GPU performance, "Good for office" may prioritize CPU and RAM).

        RETURN ONLY VALID JSON in this structure:
        {
        "_id": "",
        "CPU": "",
        "GPU": "",
        "RAM": "",
        "STORAGE": "",
        "CASE": "",
        "price": "",
        "image": ""


        }

        Do NOT add explanations, extra text, or invented parts.
`;


    const chatCompletion = await client.chat.completions.create({
      model: 'openai/gpt-oss-safeguard-20b:groq',
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const message = chatCompletion.choices[0].message.content;

    let build;
    try {
      build = JSON.parse(message); // Parse the AI's response into a valid JSON object
    } catch (error) {
      return res.status(500).json({
        message: "Invalid JSON data returned by AI.",
      });
    }
    if (
        !build._id &&
        !build.CPU &&
        !build.GPU &&
        !build.RAM &&
        !build.STORAGE &&
        !build.CASE &&
        !build.price
      ) {
        return res.status(404).json({
          message: `No valid build found within your budget of ${budgetNum} PHP`,
        });
      }
  console.log(build);
  
    return res.status(200).json({ 
        data: build
     });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export default generateBuild;
