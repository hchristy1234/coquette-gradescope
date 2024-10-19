import streamlit as st
from PIL import Image
import google.generativeai as genai
import os

# Configure Gemini API key
genai.configure(api_key=os.environ.get("GEMINI_API_KEY"))

def generate_regrade_request(exam_image, solution_image, rubric_text):
    # Open images
    exam_img = Image.open(exam_image)
    
    # Choose a Gemini model
    model = genai.GenerativeModel("gemini-1.5-flash")
    
    # Create prompt based on whether solution image is provided
    if solution_image:
        solution_img = Image.open(solution_image)
            # Create prompt
        prompt = f"""
        I have attached images of an exam that a student has filled out. I have also attached an image of the correct solutions to this question. I have attached the rubric at the bottom of this query. I would like you to act as a grader, and see if there are any mis-graded questions, or any points on the rubric that the student can argue for or ask for due to partial credit or grading errors. Only include major errors or obvious mishaps in the grading of the student's soluion, do not argue for points without a strong argument. If there are no errors, output "Your assignment has been graded correctly." Only include questions that you believe could warrant credit awarded back in your response. Additionally, please format your respone in LaTeX to deal with mathematical expressions being readable. Please format your response with new lines between item in the response in the format:
        Question Number,
        Student Response,
        Correct Response,
        Yes, award (x amount) points. Reference the rubric item. (x amount depends on the rubric item, and how many points are corresponding to this question.)
        Reasoning as to why the student's solution should be awarded additional credit.

        Rubric: {rubric_text}
        """
        response = model.generate_content([prompt, exam_img, solution_img])
    else:
            # Create prompt
        prompt = f"""
        I have attached images of an exam that a student has filled out. I have also attached an image of the correct solutions to this question. I have attached the rubric at the bottom of this query. I would like you to act as a grader, and see if there are any mis-graded questions, or any points on the rubric that the student can argue for or ask for due to partial credit or grading errors. Only include major errors or obvious mishaps in the grading of the student's soluion, do not argue for points without a strong argument. If there are no errors, output "Your assignment has been graded correctly." Only include questions that you believe could warrant credit awarded back in your response. Additionally, please format your respone in LaTeX to deal with mathematical expressions being readable. Please format your response with new lines between item in the response in the format:
        Question Number,
        Student Response,
        Correct Response,
        Yes, award (x amount) points. Reference the rubric item. (x amount depends on the rubric item, and how many points are corresponding to this question.)
        Reasoning as to why the student's solution should be awarded additional credit.

        Rubric: {rubric_text}
        """
        response = model.generate_content([prompt, exam_img])
    
    return response.text.strip()

# Streamlit UI
st.title("Regrade Request Generator")

st.header("Upload Exam and Solution Images")
exam_image = st.file_uploader("Upload Exam Image", type=["png", "jpg", "jpeg"])
solution_image = st.file_uploader("Upload Solution Image (Optional)", type=["png", "jpg", "jpeg"])

st.header("Enter Rubric")
rubric_text = st.text_area("Paste the rubric here")

if st.button("Generate Regrade Request"):
    if exam_image and rubric_text:
        # Generate regrade request
        regrade_request = generate_regrade_request(exam_image, solution_image, rubric_text)
        st.subheader("Regrade Request")
        st.write(regrade_request)
    else:
        st.error("Please upload the exam image and enter the rubric.")
