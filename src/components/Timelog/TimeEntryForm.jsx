import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
    Form,
    FormGroup,
    Label,
    Input,
    Row,
    Col,
    Button,
} from 'reactstrap'
import { postTimeEntry } from '../../actions/timeEntries' 

const TimeEntryForm = () => {
    const initialState = {
        dateOfWork: "",
        hours: 0,
        minutes: 0,
        projectId: "",
        notes: "",
        isTangible: true
    }

    const [inputs, setInputs] = useState(initialState);
    const dispatch = useDispatch();
    const { projects } = useSelector(state => state.userProjects);
    const projectOptions = projects.map(project => {
        return <option value={project.projectId}> {project.projectName} </option>
    })
    projectOptions.unshift(<option value=""></option>);
    const { userid } = useSelector(state => state.auth.user);

    const handleSubmit = async event => {
        if (event) {
            event.preventDefault();
        }

        const timeEntry = {};

        timeEntry.personId = userid;
        timeEntry.dateOfWork = inputs.dateOfWork;
        timeEntry.timeSpent = `${inputs.hours}:${inputs.minutes}:00`;
        timeEntry.projectId = inputs.projectId;
        timeEntry.notes = `<p>${inputs.notes}</p>`;
        timeEntry.isTangible = inputs.isTangible;
    
        await dispatch(postTimeEntry(timeEntry));

        setInputs(inputs => initialState);
    }

    const handleInputChange = event => {
        event.persist();
        setInputs(inputs => ({...inputs, [event.target.name]: event.target.value}));
    }

    const handleCheckboxChange = event => {
        event.persist();
        setInputs(inputs => ({...inputs, [event.target.name]: event.target.checked}));
    }


    return (
        <Form>
            <h3> Add a Time Entry </h3>
            <FormGroup>
                <Label for="dateOfWork">Date</Label>
                <Input type="date" name="dateOfWork" id="dateOfWork" placeholder="Date Placeholder" 
                    value={inputs.dateOfWork} onChange={handleInputChange}/>
            </FormGroup>
            <FormGroup>
                <Label for="timeSpent">Time (HH:MM)</Label>
                <Row form>
                    <Col>
                        <Input type="number" name="hours" id="hours" placeholder="Hours" 
                            value={inputs.hours} onChange={handleInputChange}/>
                    </Col>
                    <Col>
                        <Input type="number" name="minutes" id="minutes" placeholder="Minutes" 
                            value={inputs.minutes} onChange={handleInputChange}/>
                    </Col>
                </Row>
            </FormGroup>
            <FormGroup>
                <Label for="project">Project</Label>
                <Input type="select" name="projectId" id="projectId" 
                    value={inputs.projectId} onChange={handleInputChange}>
                    {projectOptions}
                </Input>
            </FormGroup>
            <FormGroup>
                <Label for="notes">Notes</Label>
                <Input type="textarea" name="notes" id="notes" placeholder="Notes" 
                    value={inputs.notes} onChange={handleInputChange}/>
            </FormGroup>
            <FormGroup check>
                <Label check>
                    <Input type="checkbox" name="isTangible" checked={inputs.isTangible} onChange={handleCheckboxChange}/>{' '}
                    Tangible
                </Label>
            </FormGroup>
            <Button onClick={handleSubmit}> Submit </Button>
        </Form>
    )
}

export default TimeEntryForm