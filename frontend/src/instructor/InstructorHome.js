import React, {useEffect, useState} from "react";
import {useAuth0} from "@auth0/auth0-react";
import {useHistory} from "react-router-dom";
import axios from "axios";
import {NavBar} from "../nav/NavBar";
import {createClassroom, deleteClassroom, getClassrooms} from "../requests";

export function InstructorHome(props) {
  return (
    <div>
      <NavBar firstName={props.userData['first_name']} lastName={props.userData['last_name']}/>
      <Classrooms/>
    </div>
  )
}

function Classrooms() {
  const {getAccessTokenSilently} = useAuth0();
  const [classroomTitles, setClassroomTitles] = useState();

  const history = useHistory()

  useEffect(() => {
    getAccessTokenSilently().then((token) => {
      getClassrooms(token).then((response) => {
        setClassroomTitles(
          response.data.map((data) => <li>
            <button onClick={() => {
              deleteClassroom(data['id']).then(() => history.push('/'))
            }}>
              {data['title']}
            </button>
          </li>)
        )
      })
    })
  }, [])

  return (
    <div>
      <div>
        <div>
          <p>Classes</p>
        </div>
        <ul>
          {classroomTitles}
        </ul>
      </div>
      <button onClick={() => {
        history.push('/create-classroom')
      }}>Create Classroom
      </button>
    </div>
  )
}

export function CreateClassroomForm() {
  const [title, setTitle] = useState("");
  const {getAccessTokenSilently} = useAuth0();

  const history = useHistory()

  function handleChange(event) {
    setTitle(event.target.value);
  }

  function handleSubmit(event) {
    getAccessTokenSilently().then((token) => {
      createClassroom(token).then((response) => {
        history.push('/')
      })
    })

    event.preventDefault()
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Title:
        <input type="text" value={title} onChange={handleChange}/>
      </label>
      <input type="submit" value="Submit"/>
    </form>
  )
}