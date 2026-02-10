import React from 'react';
import { Form as AntForm, ConfigProvider } from 'antd';

const Form = ({ children, ...props }) => {
    return (
        <ConfigProvider
            theme={{
                token: {
                    colorPrimary: '#F97316',
                    colorLink: '#F97316',
                    borderRadius: 8,
                },
            }}
        >
            <AntForm layout="vertical" {...props}>
                {children}
            </AntForm>
        </ConfigProvider>
    );
};

Form.Item = AntForm.Item;
Form.List = AntForm.List;
Form.useForm = AntForm.useForm;
Form.Provider = AntForm.Provider;
Form.ErrorList = AntForm.ErrorList;

export default Form;
