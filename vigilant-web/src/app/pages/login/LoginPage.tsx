import Button from 'react-bootstrap/Button'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import InputGroup from 'react-bootstrap/InputGroup'
import * as yup from 'yup'
import { Formik } from 'formik'
import 'bootstrap/dist/css/bootstrap.min.css'
import './loginPage.css'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { useAppDispatch } from '../../redux/hooks'
import { setAuthenticatedUser } from '../../redux/slices/auth.slice'
import { Card } from 'react-bootstrap'
import { useLoginMutation } from '../../services/auth.service'
import { setShowLoader } from '../../redux/slices/general.slice'

const schema = yup.object().shape({
  email: yup.string().required(),
})

const LoginPage = () => {
  const [login, { data, error, isLoading }] = useLoginMutation()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    if (data && !error) {
      console.log('LoginPage:: data:', data)
      localStorage.setItem('user', JSON.stringify(data))
      dispatch(setAuthenticatedUser(data))
      navigate('/nvigilant')
    } else if (error) {
      console.log(`LoginPage:: Authentication error`, error)
    }
  }, [data, error, dispatch, navigate])

  useEffect(() => {
    dispatch(setShowLoader(isLoading))
  }, [isLoading, dispatch])

  const handleLogin = (formValue: { email: string }) => {
    const { email } = formValue
    login({ email })
  }

  console.log('data', data)
  return (
    <div className="login-wrapper">
      <Formik
        validationSchema={schema}
        onSubmit={handleLogin}
        initialValues={{
          email: '',
        }}
      >
        {({ handleSubmit, handleChange, handleBlur, values, touched, isValid, errors }) => (
          <Card className="card" style={{ width: '18rem' }}>
            <Card.Title className="title">More Tools</Card.Title>
            <Form className="form" noValidate onSubmit={handleSubmit}>
              <Form.Group as={Col} md="12" controlId="validationFormikEmail">
                <Form.Label>Email</Form.Label>
                <InputGroup hasValidation>
                  <InputGroup.Text id="inputGroupPrepend">@</InputGroup.Text>
                  <Form.Control
                    type="text"
                    placeholder="Your login address"
                    aria-describedby="inputGroupPrepend"
                    name="email"
                    value={values.email}
                    onChange={handleChange}
                    isInvalid={!!errors.email}
                  />
                  <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
                </InputGroup>
              </Form.Group>
              <Button type="submit">Login</Button>
            </Form>
          </Card>
        )}
      </Formik>
    </div>
  )
}

export default LoginPage
