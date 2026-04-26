export interface ToolFormula {
  title: string;
  formula: string;
}

export interface ToolExample {
  question: string;
  calculation: string;
}

export interface ToolFaq {
  question: string;
  answer: string;
}

export interface RelatedTool {
  name: string;
  link: string;
  description: string;
}

export interface ToolContent {
  slug: string;
  title: string;
  shortAnswer: string;
  explanation: string[];
  formulas: ToolFormula[];
  examples: ToolExample[];
  commonMistakes: string[];
  faq: ToolFaq[];
  relatedTools: RelatedTool[];
}

export const toolContent: Record<string, ToolContent> = {
  percentage: {
    slug: "/percentage",
    title: "Percentage Calculator",
    shortAnswer:
      "Use this percentage calculator online to find percentage of a number, percentage increase, percentage decrease, and reverse percentage values in seconds.",
    explanation: [
      "This percentage calculator online is built for the exact queries people search before checking discounts, exam marks, salary growth, VAT, and price changes. You can calculate percentage increase, percentage decrease, or find what percent one number is of another without switching formulas manually.",
      "The layout keeps the three most common calculations on one screen so users can move from quick checks to more detailed comparison work with less friction.",
    ],
    formulas: [
      { title: "Find X% of Y", formula: "(X / 100) * Y" },
      { title: "Find what percent X is of Y", formula: "(X / Y) * 100" },
      { title: "Percentage increase or decrease", formula: "((New - Old) / Old) * 100" },
    ],
    examples: [
      { question: "How do I calculate 20% of 1500?", calculation: "(20 / 100) * 1500 = 300" },
      { question: "How do I calculate percentage increase from 500 to 750?", calculation: "((750 - 500) / 500) * 100 = 50%" },
      { question: "How do I reverse a 15% increase?", calculation: "1150 / 1.15 = 1000" },
    ],
    commonMistakes: [
      "Using the new value as the base when calculating percentage change instead of the original value.",
      "Forgetting to divide the percentage by 100 before multiplying.",
      "Mixing up percentage difference with percentage increase or decrease.",
      "Applying discount and VAT in the wrong order when checking shopping totals.",
    ],
    faq: [
      {
        question: "How do I calculate percentage increase from 500 to 750?",
        answer: "Subtract 500 from 750, divide by 500, then multiply by 100. The increase is 50%.",
      },
      {
        question: "What is the formula for percentage decrease?",
        answer: "Use ((old value - new value) / old value) * 100. If a price drops from 800 to 600, the decrease is 25%.",
      },
      {
        question: "How to find percentage difference between two numbers?",
        answer: "Use the percentage change formula when you have a clear starting value. If you need symmetric percentage difference, divide the absolute difference by the average of the two numbers and multiply by 100.",
      },
      {
        question: "How to calculate percentage in Excel manually?",
        answer: "Type `=part/total` in a cell, then format the result as Percentage. For growth, use `=(new-old)/old` and format as Percentage.",
      },
      {
        question: "What is 20% of 1500?",
        answer: "20% of 1500 is 300 because 0.20 multiplied by 1500 equals 300.",
      },
      {
        question: "How do I reverse a percentage calculation?",
        answer: "Divide the final value by the percentage multiplier. For example, if a total after a 10% increase is 550, divide 550 by 1.10 to get 500.",
      },
    ],
    relatedTools: [
      { name: "Interest Calculator", link: "/interest", description: "Compare rates, returns, and borrowing cost." },
      { name: "Loan Calculator", link: "/loan", description: "Estimate monthly EMI and total repayment." },
      { name: "Scientific Calculator", link: "/scientific", description: "Handle advanced math after quick percent checks." },
      { name: "Unit Converter", link: "/converter", description: "Switch values between metric and imperial units." },
    ],
  },
  converter: {
    slug: "/converter",
    title: "Unit Converter",
    shortAnswer:
      "Use this unit converter online to convert length, weight, temperature, speed, pressure, data storage, and more with one quick input.",
    explanation: [
      "This unit converter online is designed for fast, practical searches such as km to miles, kg to pounds, Celsius to Fahrenheit, and MB to GB. The result updates instantly so users can compare units without extra steps.",
      "It supports everyday conversions and technical categories in one interface, which makes it useful for students, engineers, shoppers, and travelers.",
    ],
    formulas: [
      { title: "General conversion", formula: "result = value * fromFactor / toFactor" },
      { title: "Celsius to Fahrenheit", formula: "(C * 9 / 5) + 32" },
      { title: "Fahrenheit to Celsius", formula: "(F - 32) * 5 / 9" },
    ],
    examples: [
      { question: "How many miles is 5 kilometers?", calculation: "5 / 1.60934 = 3.10686 miles" },
      { question: "How do I convert 100C to F?", calculation: "(100 * 9 / 5) + 32 = 212F" },
      { question: "How many MB in 2 GB?", calculation: "2 * 1024 = 2048 MB" },
    ],
    commonMistakes: [
      "Choosing the wrong measurement category before entering the value.",
      "Confusing metric tonnes with kilograms or pounds.",
      "Using the general multiplier method for temperature, which needs a different formula.",
      "Mixing decimal and binary data units when converting storage values.",
    ],
    faq: [
      {
        question: "How many kilometers in 1 mile?",
        answer: "1 mile equals 1.60934 kilometers.",
      },
      {
        question: "How do I convert Celsius to Fahrenheit quickly?",
        answer: "Multiply Celsius by 9, divide by 5, then add 32. For example, 30C becomes 86F.",
      },
      {
        question: "How many pounds is 1 kg?",
        answer: "1 kilogram equals about 2.20462 pounds.",
      },
      {
        question: "How to convert square feet to square meters?",
        answer: "Multiply square feet by 0.092903. For example, 100 sq ft equals 9.2903 sq m.",
      },
      {
        question: "How many MB are in a GB?",
        answer: "In binary storage, 1 GB equals 1024 MB. That is the standard used by this converter.",
      },
      {
        question: "How do I convert km/h to mph?",
        answer: "Divide kilometers per hour by 1.60934. For example, 100 km/h is about 62.14 mph.",
      },
    ],
    relatedTools: [
      { name: "Scientific Calculator", link: "/scientific", description: "Run custom formulas after unit conversion." },
      { name: "Percentage Calculator", link: "/percentage", description: "Calculate growth, discount, and percent share." },
      { name: "Loan Calculator", link: "/loan", description: "Check repayment scenarios after cost conversion." },
    ],
  },
  scientific: {
    slug: "/scientific",
    title: "Scientific Calculator",
    shortAnswer:
      "Use this scientific calculator online for trigonometry, powers, roots, logs, factorials, and advanced expressions directly in your browser.",
    explanation: [
      "This scientific calculator online is optimized for students, engineers, and anyone who needs more than basic arithmetic. It handles trigonometric functions, logarithms, exponents, constants, and memory operations in one keypad.",
      "The larger display and keyboard shortcuts make it easier to work through long expressions without losing track of intermediate inputs.",
    ],
    formulas: [
      { title: "Square root", formula: "sqrt(x)" },
      { title: "Exponent", formula: "x^y" },
      { title: "Trigonometry", formula: "sin(x), cos(x), tan(x)" },
    ],
    examples: [
      { question: "How do I calculate sqrt(144)?", calculation: "sqrt(144) = 12" },
      { question: "How do I evaluate 2^10?", calculation: "2^10 = 1024" },
      { question: "How do I calculate sin(pi/2)?", calculation: "sin(pi/2) = 1" },
    ],
    commonMistakes: [
      "Typing a function without closing the parenthesis.",
      "Using degree values directly when the math engine expects radians.",
      "Mixing multiplication symbols from the keyboard and display in copied expressions.",
      "Forgetting order of operations inside longer equations.",
    ],
    faq: [
      {
        question: "How do I use a scientific calculator for sin cos tan?",
        answer: "Enter the trig function, then the input in radians, and close the bracket. For example, `sin(pi/2)` returns 1.",
      },
      {
        question: "How do I calculate square root on a scientific calculator?",
        answer: "Use `sqrt(`, enter the number, then close the parenthesis. Example: `sqrt(49)` returns 7.",
      },
      {
        question: "How to use log on a scientific calculator?",
        answer: "Use `log(` for base-10 logarithm and `ln(` for natural logarithm. Example: `log(100)` returns 2.",
      },
      {
        question: "How do I calculate powers like 2 to the power of 10?",
        answer: "Enter `2^10` and evaluate. The result is 1024.",
      },
      {
        question: "Does a scientific calculator use degrees or radians?",
        answer: "This calculator evaluates trig functions in radians because it uses a math expression engine. Use `pi` values for angle input.",
      },
      {
        question: "How do I use pi on a scientific calculator?",
        answer: "Tap the `pi` button or use the keyboard shortcut for `pi` to insert the constant into your expression.",
      },
    ],
    relatedTools: [
      { name: "Unit Converter", link: "/converter", description: "Convert values before or after advanced calculations." },
      { name: "Percentage Calculator", link: "/percentage", description: "Quickly switch from scientific math to percent tasks." },
      { name: "Interest Calculator", link: "/interest", description: "Model savings and investment growth." },
    ],
  },
  age: {
    slug: "/age",
    title: "Age Calculator",
    shortAnswer:
      "Use this age calculator online to find exact age in years, months, and days, total days lived, and days left until the next birthday.",
    explanation: [
      "This exact age calculator is built for the real queries people make when filling forms, checking eligibility, or verifying age for school admission, jobs, passports, and insurance.",
      "It calculates the difference between the date of birth and the selected current date while accounting for month lengths and leap years.",
    ],
    formulas: [
      { title: "Age logic", formula: "age = currentDate - dateOfBirth" },
      { title: "Total days lived", formula: "floor((currentDate - dateOfBirth) / 86400000)" },
      { title: "Next birthday countdown", formula: "nextBirthday - currentDate" },
    ],
    examples: [
      { question: "If born on 2000-01-01, how old am I on 2024-01-01?", calculation: "24 years, 0 months, 0 days" },
      { question: "How many days until next birthday?", calculation: "The tool compares today with the next matching birth date and returns the remaining days." },
      { question: "How many total days have I lived?", calculation: "The calculator counts the full day difference between birth date and current date." },
    ],
    commonMistakes: [
      "Using the wrong date format when entering date of birth.",
      "Forgetting that age can change depending on the exact current date selected.",
      "Manually subtracting years without accounting for whether the birthday has passed this year.",
      "Ignoring leap years when checking total days lived.",
    ],
    faq: [
      {
        question: "How do I calculate my exact age from date of birth?",
        answer: "Enter your date of birth and the current date. The calculator compares both dates and returns your exact age in years, months, and days.",
      },
      {
        question: "How many days old am I today?",
        answer: "Use your date of birth in the calculator and it will return total days lived based on the selected current date.",
      },
      {
        question: "How to calculate age for school admission?",
        answer: "Set the admission cutoff date as the current date in the calculator. That gives the exact age on the required deadline.",
      },
      {
        question: "How old will I be in 2030?",
        answer: "Set the current date field to any date in 2030 and the tool will calculate your exact future age.",
      },
      {
        question: "How many months old is a baby calculator?",
        answer: "Enter the birth date and the current date to see the months and days portion of age accurately.",
      },
      {
        question: "How many days until my next birthday?",
        answer: "After entering your birth date, the tool also shows the countdown to your next birthday in days.",
      },
    ],
    relatedTools: [
      { name: "Percentage Calculator", link: "/percentage", description: "Check growth, scores, and percentage change." },
      { name: "Loan Calculator", link: "/loan", description: "Estimate age-based repayment timelines." },
      { name: "Interest Calculator", link: "/interest", description: "Model savings duration and growth." },
    ],
  },
  loan: {
    slug: "/loan",
    title: "Loan Calculator",
    shortAnswer:
      "Use this loan calculator online to estimate EMI, total interest, and total repayment for personal loans, car loans, or home loans.",
    explanation: [
      "This loan calculator online is designed around the high-intent searches users make before borrowing, including EMI calculator BD, monthly installment checks, and total payable comparisons across different tenures.",
      "It shows the monthly EMI along with the full cost of borrowing so users can compare rate and tenure changes without manual spreadsheets.",
    ],
    formulas: [
      { title: "EMI formula", formula: "EMI = P * r * (1 + r)^n / ((1 + r)^n - 1)" },
      { title: "Monthly rate", formula: "r = annualRate / 12 / 100" },
      { title: "Total repayment", formula: "totalPayment = EMI * n" },
    ],
    examples: [
      { question: "What is the EMI for a 500000 loan at 10% for 5 years?", calculation: "Monthly EMI is about 10624.67 and total repayment is about 637480.20" },
      { question: "How do I compare 5-year vs 7-year EMI?", calculation: "Use the same loan amount and rate with two tenure values. The longer tenure lowers EMI but increases total interest." },
      { question: "How does a lower interest rate affect EMI?", calculation: "Reducing the annual rate decreases both EMI and total repayment over the loan term." },
    ],
    commonMistakes: [
      "Comparing only EMI and ignoring total interest paid over the full tenure.",
      "Using annual interest directly in the EMI formula without converting it to monthly rate.",
      "Choosing a longer tenure for affordability without checking total borrowing cost.",
      "Assuming the calculator includes fees, insurance, or prepayment penalties automatically.",
    ],
    faq: [
      {
        question: "How do I calculate EMI on a loan?",
        answer: "Enter the loan amount, annual interest rate, and tenure. The calculator uses the standard EMI formula to show your monthly installment instantly.",
      },
      {
        question: "What is the EMI for 500000 loan for 5 years?",
        answer: "At 10% annual interest for 5 years, the EMI is about 10624.67 per month. Exact EMI changes with the rate you enter.",
      },
      {
        question: "How to calculate home loan interest and EMI?",
        answer: "Use the same calculator for home loans by entering the property loan amount, annual rate, and repayment period in years or months.",
      },
      {
        question: "What is reducing balance loan calculation?",
        answer: "A reducing balance loan charges interest on the outstanding principal, so the interest portion decreases as you repay the loan.",
      },
      {
        question: "How do I reduce my EMI amount?",
        answer: "You can lower EMI by increasing the tenure, reducing the loan amount, or securing a lower interest rate.",
      },
      {
        question: "How much interest will I pay on my loan?",
        answer: "The calculator shows total interest separately so you can see the full borrowing cost before applying for the loan.",
      },
    ],
    relatedTools: [
      { name: "Interest Calculator", link: "/interest", description: "Compare simple and compound interest scenarios." },
      { name: "Percentage Calculator", link: "/percentage", description: "Check discounts, margins, and percentage change." },
      { name: "Age Calculator", link: "/age", description: "Estimate repayment timelines against age targets." },
    ],
  },
  interest: {
    slug: "/interest",
    title: "Interest Calculator",
    shortAnswer:
      "Use this interest calculator online to calculate simple interest, compound interest, total interest earned, and final maturity amount.",
    explanation: [
      "This interest calculator online covers the search intent behind savings growth, FD returns, loan interest checks, and compound interest examples. Users can switch between simple and compound interest and compare compounding frequencies quickly.",
      "It is useful for investment planning, loan estimates, and classroom examples where the final amount matters as much as the interest portion.",
    ],
    formulas: [
      { title: "Simple interest", formula: "SI = P * R * T" },
      { title: "Compound amount", formula: "A = P * (1 + r / n)^(n * t)" },
      { title: "Compound interest", formula: "CI = A - P" },
    ],
    examples: [
      { question: "What is simple interest on 10000 at 8% for 2 years?", calculation: "10000 * 0.08 * 2 = 1600" },
      { question: "What is compound interest on 10000 at 8% for 2 years compounded yearly?", calculation: "10000 * (1 + 0.08)^2 = 11664, so interest is 1664" },
      { question: "How does monthly compounding change returns?", calculation: "More frequent compounding slightly increases the final amount compared with annual compounding." },
    ],
    commonMistakes: [
      "Confusing total amount with total interest earned.",
      "Using the percentage rate as a whole number instead of converting it to decimal in manual formulas.",
      "Forgetting to match compounding frequency with the formula.",
      "Mixing months and years without converting the time period correctly.",
    ],
    faq: [
      {
        question: "How do I calculate simple interest?",
        answer: "Multiply principal by annual rate in decimal form and by time in years. For example, 10000 at 8% for 2 years gives 1600 in simple interest.",
      },
      {
        question: "How do I calculate compound interest monthly?",
        answer: "Use the compound formula with `n = 12`, which means interest is added every month.",
      },
      {
        question: "What is the difference between simple and compound interest?",
        answer: "Simple interest is calculated only on principal, while compound interest is calculated on principal plus previously added interest.",
      },
      {
        question: "How much interest will 10000 earn in 5 years?",
        answer: "That depends on rate, interest type, and compounding frequency. Enter your values to see both interest earned and total amount.",
      },
      {
        question: "How do I calculate bank interest on savings?",
        answer: "Enter your deposit amount, annual rate, and time period. If the bank compounds interest, choose compound interest and the correct frequency.",
      },
      {
        question: "What is compound interest formula with example?",
        answer: "The formula is `A = P * (1 + r / n)^(n * t)`. If P is 1000, r is 0.05, n is 1, and t is 2, the final amount is 1102.50.",
      },
    ],
    relatedTools: [
      { name: "Loan Calculator", link: "/loan", description: "Check EMI after comparing rate scenarios." },
      { name: "Percentage Calculator", link: "/percentage", description: "Calculate rate changes and return percentages." },
      { name: "Scientific Calculator", link: "/scientific", description: "Work through custom finance formulas manually." },
    ],
  },
  typing: {
    slug: "/typing-test",
    title: "Typing Speed Test",
    shortAnswer:
      "Use this typing speed test online to measure WPM, CPM, accuracy, and mistakes in English or Bangla with multiple difficulty levels.",
    explanation: [
      "This typing speed test online targets the practical searches users make when preparing for job tests, improving keyboard speed, or practicing bilingual typing. It gives live feedback on speed and accuracy instead of waiting until the end.",
      "English and Bangla support, flexible time limits, and difficulty settings make it useful for both beginners and experienced typists.",
    ],
    formulas: [
      { title: "Words per minute", formula: "WPM = (correctCharacters / 5) / timeInMinutes" },
      { title: "Characters per minute", formula: "CPM = totalTypedCharacters / timeInMinutes" },
      { title: "Accuracy", formula: "(correctCharacters / totalTypedCharacters) * 100" },
    ],
    examples: [
      { question: "If I type 250 correct characters in 1 minute, what is my WPM?", calculation: "(250 / 5) / 1 = 50 WPM" },
      { question: "If I type 300 characters in 60 seconds, what is my CPM?", calculation: "300 / 1 = 300 CPM" },
      { question: "How does accuracy affect typing performance?", calculation: "Higher accuracy means more correct characters count toward WPM." },
    ],
    commonMistakes: [
      "Focusing only on speed while accuracy drops sharply.",
      "Looking at the keyboard too often instead of training finger memory.",
      "Practicing with only one language when bilingual performance matters.",
      "Restarting too often instead of finishing full timed sessions.",
    ],
    faq: [
      {
        question: "How is typing speed measured in WPM?",
        answer: "Typing speed is measured by dividing correct characters by 5 and then dividing by time in minutes.",
      },
      {
        question: "What is a good typing speed for jobs?",
        answer: "Around 40 WPM is average, 50 to 60 WPM is good for many office roles, and higher speeds are strong for data entry or transcription work.",
      },
      {
        question: "How can I improve typing speed without losing accuracy?",
        answer: "Practice shorter sessions with consistent finger placement, focus on clean keystrokes, and increase speed gradually once accuracy stays stable.",
      },
      {
        question: "How do I test typing speed in Bangla?",
        answer: "Switch the language selector to Bangla, choose your difficulty, and start typing to measure Bangla WPM and accuracy.",
      },
      {
        question: "What is CPM in typing test?",
        answer: "CPM means characters per minute. It shows how many total characters you typed during the timed test.",
      },
      {
        question: "How much accuracy is good in typing test?",
        answer: "Accuracy above 95% is strong for most practical typing tasks because it keeps correction time low.",
      },
    ],
    relatedTools: [
      { name: "Word Counter", link: "/word-counter", description: "Check words, characters, and reading time." },
      { name: "Scientific Calculator", link: "/scientific", description: "Use quick keyboard-friendly calculations." },
      { name: "Age Calculator", link: "/age", description: "Another fast utility for form and profile checks." },
    ],
  },
  "word-counter": {
    slug: "/word-counter",
    title: "Word Counter",
    shortAnswer:
      "Use this word counter online to count words, characters, sentences, paragraphs, and reading time instantly while you type.",
    explanation: [
      "This word counter online is built for writers, students, marketers, and job applicants who need fast checks for essay length, post limits, and character restrictions.",
      "It updates in real time and includes both characters with spaces and characters without spaces, which helps with social, academic, and SEO writing tasks.",
    ],
    formulas: [
      { title: "Word count", formula: "words = split(trimmedText by whitespace)" },
      { title: "Characters without spaces", formula: "charactersNoSpaces = text.replace(/\\s/g, '').length" },
      { title: "Reading time", formula: "ceil(words / 200)" },
    ],
    examples: [
      { question: "How many words are in a 1000-word essay?", calculation: "Paste the draft and the tool will return exact words, characters, and estimated reading time." },
      { question: "How many characters are allowed in a tweet?", calculation: "Use the live character counter to stay within the platform limit." },
      { question: "How long is a 600-word article to read?", calculation: "ceil(600 / 200) = 3 minutes" },
    ],
    commonMistakes: [
      "Using a word count target without checking character limits for platforms or forms.",
      "Assuming all systems count spaces the same way.",
      "Ignoring paragraph and sentence counts when checking readability.",
      "Estimating reading time manually instead of using actual word count.",
    ],
    faq: [
      {
        question: "How do I count words in an essay online?",
        answer: "Paste or type your essay into the editor and the tool will show the live word count instantly.",
      },
      {
        question: "How many characters are in my text?",
        answer: "The character counter updates while you type and shows both total characters and characters without spaces.",
      },
      {
        question: "How do I count characters without spaces?",
        answer: "Use the dedicated `Characters (No Spaces)` metric shown beside the standard character count.",
      },
      {
        question: "How long is a 1000 word article to read?",
        answer: "At an estimated reading speed of 200 words per minute, a 1000-word article takes about 5 minutes to read.",
      },
      {
        question: "What is the difference between word count and character count?",
        answer: "Word count measures separated words, while character count measures every typed character including letters, punctuation, and sometimes spaces depending on the metric.",
      },
      {
        question: "Can I count sentences and paragraphs online?",
        answer: "Yes. The tool tracks sentence count and paragraph count automatically as you write or paste text.",
      },
    ],
    relatedTools: [
      { name: "Typing Speed Test", link: "/typing-test", description: "Measure how fast you can type your content." },
      { name: "Percentage Calculator", link: "/percentage", description: "Calculate score percentages and growth metrics." },
      { name: "Scientific Calculator", link: "/scientific", description: "Handle supporting calculations while writing." },
    ],
  },
};

export const getToolContent = (key: string) => toolContent[key];
