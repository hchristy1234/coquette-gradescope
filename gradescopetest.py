import streamlit as st
from PIL import Image
import google.generativeai as genai
import os

genai.configure(api_key=os.environ.get("GEMINI_API_KEY"))

# Add a button with default Streamlit styling
st.markdown(
    """
    <style>
    .button-container {
        display: flex;
        justify-content: flex-start;
        margin-bottom: 20px;
    }
    .button {
        background-color: #f0f2f6; /* Default Streamlit button color */
        border: none;
        color: #000;
        padding: 8px 16px;
        text-align: center;
        text-decoration: none;
        display: inline-block;
        font-size: 16px;
        cursor: pointer;
        border-radius: 4px;
    }
    </style>
    <div class="button-container">
        <a href="https://chromewebstore.google.com/category/extensions" target="_blank" class="button">Visit Chrome Extensions</a>
    </div>
    """,
    unsafe_allow_html=True
)

def generate_regrade_request(exam_image, solution_image, rubric_image):
    exam_img = Image.open(exam_image)
    model = genai.GenerativeModel("gemini-1.5-flash")
    
    if solution_image and rubric_image:
        solution_img = Image.open(solution_image)
        rubric_img = Image.open(rubric_image)
        prompt = f"""
        -Target activity-
        You are an intelligent assistant that helps a student to write regrade requests for assignments where points should have been awarded, but were not.

        -Goal-
        Given an image of the student's exam with their solutions, an image with the true exam solutions, and a rubric image with points assigned to each part of a question, extract all questions where the student should have been awarded points, but was not, either directly because of a mistake in how the rubric was applied, or the grader did not think the student's solution matched the true solution, when it actually does. Then output reasoning as to why the student should have received points.

        -Steps-
        1. Extract all questions and their numbers. With each question number, extract the student's response and the true solution, and compare them.
        2. For each question identified in step 1, determine if, by the rubric, the student's response should have received credit where it was not originally awarded. Use the true solution as a guideline for comparing the student's answers.
        For each question, output the following information:
        - Question Number and optionally Question Letter: Number of the question that the student should receive credit back. Question needs to be one of the named entities identified in step 2, where credit should have been awarded, confidently.
        - Student Response: The student's response to the question. Write this in LaTeX, in case there are mathematical expressions for the output to be readable.
        - Correct Response: The true solution to the question. Write this in LaTeX, in case there are mathematical expressions for the output to be readable.
        - Points to be awarded: The points to be awarded depends on how the student solution matches the rubric. For example, if the rubric awards 3 points for having a partially complete answer, and the student was originally awarded 0 points, there should be 3 points awarded.
        - Reasoning: Detailed description explaining the reasoning behind the regrade request, together with all the related evidence and references to the student's response and the true solution.

        Format each claim as above, with new lines for each bullet of information where necessary. Please write all your output in LaTeX, for readability.

        3. Return output in English, using LaTeX.

        -Example Outputs-
        Example 1:
        Question 1:
        Student Response: The student answered B(n) = O(2n).
        Correct Response: The correct answer for B(n) is B(n) = O(n).
        Points to be awarded: +3, as any answer that simplified to O(n) should be awarded partial credit of 3 points according to the rubric.
        Reasoning: Credit should be awarded as the student provided an unsimplified expression for B(n), that ultimately simplified to O(n), which is the correct response.

        Example 2:
        Question 3:
        Student Response: The student wrote the recurrence relation as: T(n) = 2T(n/2) + O(2n)
        Correct Response: The correct recurrence relation is: T(n) = 2T(n/2) + O(n)
        Points to be awarded: +1, as the rubric awards one point for partial credit, identified by the student having carry over error from Question 1.
        Reasoning: While the student has the incorrect expression for T(n), they have identified the basic recurrence structure, and have carried forward the incorrect expression for B(n) from question 1. This qualifies for partial credit based on the rubric.

        -Real Data-
        Use the following input for your answer.
        Student exam: exam_img
        Solutions for exam: solution_img
        Rubric: rubric_img
        """
        response = model.generate_content([prompt, exam_img, solution_img, rubric_img])
    else:
        st.error("Please upload all required images.")
        return None
    
    return response.text.strip()

st.title("Regrade Request Generator")

st.header("Upload Exam, Solution, and Rubric Images")
exam_image = st.file_uploader("Upload Exam Image", type=["png", "jpg", "jpeg"])
solution_image = st.file_uploader("Upload Solution Image (Optional)", type=["png", "jpg", "jpeg"])
rubric_image = st.file_uploader("Upload Rubric Image", type=["png", "jpg", "jpeg"])

if st.button("Generate Regrade Request"):
    if exam_image and rubric_image:
        regrade_request = generate_regrade_request(exam_image, solution_image, rubric_image)
        if regrade_request:
            st.subheader("Regrade Request")
            st.write(regrade_request)
    else:
        st.error("Please upload the exam and rubric images.")
