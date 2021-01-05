import {InputHTMLAttributes} from 'react'
import { FormControl, FormLabel, Input, FormErrorMessage, Textarea, ComponentWithAs, InputProps, TextareaProps } from '@chakra-ui/react';
import React from 'react'
import {Formik,Form,Field,useField} from 'formik'


type InputFieldProps = InputHTMLAttributes<HTMLInputElement> &{
    name:string;
    label:string;
    textare?:boolean 
};

type InputType = ComponentWithAs<"input", InputProps>|ComponentWithAs<"textarea", TextareaProps>

 const InputField: React.FC<InputFieldProps> = ({label,textare,size: _,...props}) =>{
         let InputOrTextare:InputType = Input;
         if(textare){
             (InputOrTextare as InputType) = Textarea 
         }
        const [field,{error}] = useField(props);
        return (
            <FormControl isInvalid={!!error}>
                <FormLabel htmlFor="username">{label}</FormLabel>
                <InputOrTextare {...field} id={field.name} {...props} />
                { error ?<FormErrorMessage>{error}</FormErrorMessage>:null}
              </FormControl>
        );
}
export default InputField;