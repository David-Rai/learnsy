# Learnsy
✨ Learn while you scroll.

# Commiting standard
feat	New feature
fix	    Bug fix
chore	Miscellaneous tasks (no code change)
docs	Documentation updates
style	Formatting, linting, or styling (no logic change)
refactor	Code change that neither fixes a bug nor adds a feature
test	Adding or updating tests
perf	Performance improvement

# Promt for generating questions
```bash
Generate a CSV file of questions in the following format:
Columns: q,a,hint,options,category,lesson
- q: question text
- a: correct answer
- hint: a short hint or tip about the question
- options: an array of 4 options (e.g., ['option1','option2','option3','option4']). 
           If the question is yes/no type, use ['yes','no'] and set a to 'yes' or 'no'.
- category: [INSERT CATEGORY HERE] (I will provide this)
- lesson: 4 different lessons, each lesson contains 5 questions (total 20 questions)

Rules:
1. Questions should be related to the given category.
2. Mix simple yes/no questions and multiple-choice questions.
3. For yes/no questions, options should be ['yes','no'].
4. For multiple-choice questions, options should always contain exactly 4 options.
5. Provide hints that are concise and helpful.

Output: CSV format only, with headers included.

Example:

q,a,hint,options,category,lesson
"Is HTML a programming language?","no","HTML is a markup language, not a programming language","['yes','no']","web","HTML Basics"
"Does CSS change the style of a webpage?","yes","CSS is used to style HTML elements","['yes','no']","web","CSS Basics"
"Which HTML tag defines a paragraph?","<p>","Paragraph tag","['<p>','<div>','<h1>','<span>']","web","HTML Basics"

```
