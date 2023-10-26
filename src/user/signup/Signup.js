import React, { Component } from 'react';
import { signup } from '../../util/APIUtils';
import './Signup.css';
import { Link } from 'react-router-dom';
import { 
    NAME_MIN_LENGTH, NAME_MAX_LENGTH, 
    USERNAME_MIN_LENGTH, USERNAME_MAX_LENGTH,
    EMAIL_MAX_LENGTH,
    PASSWORD_MIN_LENGTH, PASSWORD_MAX_LENGTH,
    MOBILE_MIN_LENGTH,MOBILE_MAX_LENGTH
} from '../../constants';
import { Form, Input, Button, notification } from 'antd';
const FormItem = Form.Item;

class Signup extends Component {
    render() {
        const AntWrappedSignupForm = Form.create()(SignupForm)
        return (
            <AntWrappedSignupForm history = {this.props.history}/>
        );
    }
}

class SignupForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            confirmDirty: false,
            value : ""
        }
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(event) {
        event.preventDefault();
    
        this.props.form.validateFields((err, values) => {
            if (!err) {
                const signupRequest = Object.assign({}, values);
                signup(signupRequest)
                .then(response =>{
                    if(response.success === true){
                        notification.success({
                            message: 'Booking Clinic',
                            description: "You have successfully registered your account!",
                        });
                        
                        this.props.history.push("/login");
                    }
                }).catch(error => {
                    notification.error({
                        message: 'Booking Clinic',
                        description: error.message || "I'm sorry, but the registration failed"
                    });                    
                });
            }
        });
    }

    validateToNextPassword = (rule, value, callback) => {
        const { form } = this.props;
        if (value && this.state.confirmDirty) {
          form.validateFields(['confirm_password'], { force: true });
        }
        callback();
    };

    compareToFirstPassword = (rule, value, callback) => {
        const { form } = this.props;
        if (value && value !== form.getFieldValue('password')) {
          callback('The passwords you entered do not match!');
        } else {
          callback();
        }
    };

    validateName = (rule, fullName, callback ) => {
        if(fullName.length < NAME_MIN_LENGTH) {
            callback("The full name is too short! Please enter a longer ( "+NAME_MIN_LENGTH+ " ) characters!");
        } else if (fullName.length > NAME_MAX_LENGTH) {
            callback("The full name is too long! Please enter a shorter(  "+NAME_MAX_LENGTH+ " )  characters!");
        }else {
            callback();
        }
    }

    validateEmail = (rule, email, callback) => {
        const EMAIL_REGEX = RegExp('[^@ ]+@[^@ ]+\\.[^@ ]+');
        if(!email) {
            callback("Email cannot be empty!");
        }

        if(!EMAIL_REGEX.test(email)) {
            callback("The email is not in the correct format!");
        }

        if(email.length > EMAIL_MAX_LENGTH) {
            callback("The email is too long! Please enter a shorter than ( "+EMAIL_MAX_LENGTH+ " ) characters !");
        } else {
            callback();
        }
    }

    validateMobile = (rule, mobile,callback) => {
        if(mobile.length < MOBILE_MIN_LENGTH) {
            callback("The phone number is too short! Please enter a longer than( "+MOBILE_MIN_LENGTH+ " ) characters !");
        
        } else if (mobile.length > MOBILE_MAX_LENGTH) {
            callback("The phone number is too long! Please enter a shorter than ( "+MOBILE_MAX_LENGTH+ " ) characters !");
        } else {
            callback();
        }
    }

    validateUsername = (rule, username,callback) => {
        if(username.length < USERNAME_MIN_LENGTH) {
            callback("The username is too short! Please enter a longer than ( "+USERNAME_MIN_LENGTH+ " ) characters !");
            
        } else if (username.length > USERNAME_MAX_LENGTH) {
            callback("The username is too long! Please enter a shorter than ( "+USERNAME_MAX_LENGTH+ " ) characters !");
        } else {
            callback();
        }
    }

    validatePassword = (rule, password,callback) => {
        if(password.length < PASSWORD_MIN_LENGTH) {
            callback("The password is too short! Please enter a longer than ( "+PASSWORD_MIN_LENGTH+ " ) characters !");
        } else if (password.length > PASSWORD_MAX_LENGTH) {
            callback("The password is too long! Please enter a shorter than ( "+PASSWORD_MAX_LENGTH+ " ) characters !");
        } else {
            callback();
        }
    }

    handleConfirmBlur = e => {
        const { value } = e.target;
        this.setState({ confirmDirty: this.state.confirmDirty || !!value });
      };

    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <div className="signup-container">
                <h1 className="page-title">Sign Up</h1>
                <div className="signup-content">
                    <Form onSubmit={this.handleSubmit} className="signup-form">
                        <FormItem className = "row-file"
                            label={
                                <span><strong>Họ và Tên</strong></span>
                            }>
                            {getFieldDecorator('fullName', {
                                rules: [
                                    { 
                                        required: true, message: 'Please enter your full name!'
                                    },
                                    {
                                        validator: this.validateName,
                                    }
                                ],
                            })(<Input 
                                size="large"
                                name="fullName"
                                autoComplete="off"
                                placeholder="Please enter your full name!"
                            />)}
                        </FormItem>
                        <FormItem className = "row-file"
                            label={
                                <span> <strong>Username</strong></span>
                            }>
                            {getFieldDecorator('username', {
                                rules: [
                                    { 
                                        required: true, message: 'Please enter your login username!' 
                                    },
                                    {
                                        validator: this.validateUsername,
                                    }
                                ],
                            })(<Input 
                                size="large"
                                name="username"
                                autoComplete="off"
                                placeholder="Please enter your login username!"
                            />)}
                        </FormItem>
                        <FormItem className = "row-file"
                            label={
                                <span> <strong>Số điện thoại</strong></span>
                            }>
                            {getFieldDecorator('mobile', {
                                rules: [
                                    { required: true, message: 'Please enter your phone number!'},
                                    {
                                        validator: this.validateMobile,
                                    }
                                ],
                            })(<Input 
                                size="large"
                                name="mobile"
                                autoComplete="off"
                                placeholder="Please enter your phone number!"
                            />)}
                        </FormItem>
                        <FormItem className = "row-file"
                             label={
                                <span> <strong>E-mail</strong></span>
                            }>
                            {getFieldDecorator('email', {
                                rules: [
                                    {
                                        type: 'email',
                                        message: 'Email format error!',
                                    },
                                    {
                                        required: true,
                                        message: 'Please enter your email!',
                                    },
                                    {
                                        validator: this.validateEmail,
                                    }
                                ],
                            })(<Input 
                                size="large"
                                name="email" 
                                autoComplete="off"
                                placeholder="Please enter your email!"
                            />)}
                        </FormItem>
                        <FormItem  className = "row-file"  
                            label={
                                <span> <strong>Password</strong></span>
                            } hasFeedback>
                                
                            {getFieldDecorator('password', {
                                rules: [
                                    {
                                        required: true,
                                        message: 'Please enter your password!',
                                    },
                                    {
                                        validator: this.validateToNextPassword,
                                    },
                                    {
                                        validator: this.validatePassword,
                                    }
                                ],
                            })(<Input.Password 
                                size="large"
                                name="password" 
                                autoComplete="off"
                                placeholder="Please enter your password!"
                            />)}
                        </FormItem>
                        <FormItem  className = "row-file" label={
                                <span> <strong>Confirm Password</strong></span>
                            } hasFeedback>
                            {getFieldDecorator('confirm_password', {
                                rules: [
                                    {
                                        required: true,
                                        message: 'Please re-enter your password!',
                                    },
                                    {
                                        validator: this.compareToFirstPassword,
                                    },
                                ],
                            })(<Input.Password placeholder="Please re-enter your password!" size="large" onBlur={this.handleConfirmBlur} />)}
                        </FormItem>       
                        <FormItem>
                            <Button type="primary" 
                                htmlType="submit" 
                                size="large" 
                                className="signup-form-button">Đăng ký</Button>
                                Already registed? <Link to="/login"><strong>Đăng nhập!</strong></Link>
                        </FormItem>
                    </Form>
                </div>
            </div>
        );
    }

}

export default Signup;