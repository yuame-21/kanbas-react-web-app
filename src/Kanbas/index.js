import KanbasNavigation from "./KanbasNavigation";
import { Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./Dashboard";
import Courses from "./Courses"
import db from "./Database";
import { useEffect, useState } from "react";
import store from "./store";
import { Provider } from "react-redux";
import axios from "axios";

function Kanbas() {
    const [courses, setCourses] = useState([]);
    const URL = "http://localhost:4000/api/courses";
    const findAllCourses = async () => {
        const response = await axios.get(URL);
        setCourses(response.data);
    };

    useEffect(() => {
        findAllCourses();
    }, []);

    const [course, setCourse] = useState({
                                             name: "New Course", number: "New Number",
                                             startDate: "2023-09-10", endDate: "2023-12-15",
                                         });

    const deleteCourse = async (courseId) => {
        const response = await axios.delete(
            `${URL}/${courseId}`
        );
        setCourses(courses.filter((course) => course.id !== courseId));
    };

    const addNewCourse = async () => {
        const response = await axios.post(URL, course);
        setCourses([response.data, ...courses]);
        setCourse({ name: "" });
    };

    const updateCourse = async () => {
        const response = await axios.put(
            `${URL}/${course.id}`,
            course
        );
        setCourses(
            courses.map((c) => {
                if (c.id === course.id) {
                    return course;
                } else {
                    return c;
                }
            })
        );
    };

    return (
        <Provider store={store}>

        <div className="d-flex">
            <div>
                <KanbasNavigation/>
            </div>
            <div>
                <Routes>
                    <Route path="/" element={<Navigate to="Dashboard" />} />
                    <Route path="Account" element={<h1>Account</h1>} />
                    <Route path="Dashboard" element=
                        {<Dashboard
                        courses={courses}
                        course={course}
                        setCourse={setCourse}
                        addNewCourse={addNewCourse}
                        deleteCourse={deleteCourse}
                        updateCourse={updateCourse}/>} />
                    <Route path="Courses/:courseId/*" element={<Courses />} />
                </Routes>

            </div>
        </div>
        </Provider>
    );
}
export default Kanbas;

