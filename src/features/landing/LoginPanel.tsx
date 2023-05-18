import {
  createUserWithEmailAndPassword,
  getAuth,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
} from 'firebase/auth';
import React from 'react';
import styled, { keyframes } from 'styled-components/macro';
import cityLandScape from '../../assets/cityLandscape.png';
import googleLogo from '../../assets/googleLogo.png';
import loginSlogan from '../../assets/login_slogan.png';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import {
  EDIT_LOGIN_INPUT,
  TOGGLE_LOGIN_SECTION_FOCUS,
  TOGGLE_NEW_REGISTER,
  TOGGLE_PASSWORD_VISIBILITY,
} from '../../redux/reducers/landingIntroSlice';
import { TOGGLE_AUTHING } from '../../redux/reducers/userInfoSlice';
import { FirebaseError } from 'firebase/app';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

export const LoginPanel: React.FC = () => {
  const { isFocusingLogin, loginInput, isNewRegister } = useAppSelector(
    (state) => state.landingIntro
  );
  const dispatch = useAppDispatch();

  const auth = getAuth();

  const GoogleLogin = async () => {
    dispatch(TOGGLE_AUTHING(true));
    try {
      await signInWithPopup(auth, new GoogleAuthProvider());
    } catch (error: any) {
      console.log(error.code);
    }
  };
  const nativeRegister = async () => {
    try {
      await createUserWithEmailAndPassword(
        auth,
        loginInput.email,
        loginInput.password
      );
    } catch (error: any) {
      console.log(error.code);
    }
  };
  const nativeLogin = async () => {
    try {
      await signInWithEmailAndPassword(
        auth,
        loginInput.email,
        loginInput.password
      );
    } catch (error: any) {
      console.log(error.code);
    }
  };

  const loginForm: {
    field: 'email' | 'password';
    ch: string;
    minLength: number;
  }[] = [
    { field: 'email', ch: '信箱', minLength: 0 },
    { field: 'password', ch: '密碼', minLength: 6 },
  ];

  const handleInputType = (
    type: string,
    isPasswordVisibile: boolean
  ): string => {
    if (type === 'password' && isPasswordVisibile) {
      return 'text';
    }
    return type;
  };

  return (
    <Wrap
      onMouseEnter={() => dispatch(TOGGLE_LOGIN_SECTION_FOCUS(true))}
      onMouseLeave={() =>
        setTimeout(() => dispatch(TOGGLE_LOGIN_SECTION_FOCUS(false)))
      }
    >
      <LoginSlogan $isFocusing={isFocusingLogin} src={loginSlogan} />
      <CityImage src={cityLandScape} />
      {loginForm.map((form) => (
        <InputWrap>
          <InputTitle>{form.ch}</InputTitle>
          <LoginInput
            value={loginInput[form.field]}
            type={handleInputType(form.field, loginInput.isPasswordVisibile)}
            onChange={(event) => {
              dispatch(
                EDIT_LOGIN_INPUT({
                  field: form.field,
                  value: event.target.value,
                })
              );
              dispatch(TOGGLE_LOGIN_SECTION_FOCUS(true));
            }}
            minLength={form.minLength}
          />
          {form.field === 'password' && (
            <InputIcon
              icon={loginInput.isPasswordVisibile ? faEyeSlash : faEye}
              onClick={() => dispatch(TOGGLE_PASSWORD_VISIBILITY())}
            />
          )}
        </InputWrap>
      ))}
      {isNewRegister ? (
        <>
          <LoginWrap $isFocusing={isFocusingLogin} onClick={nativeRegister}>
            註冊
          </LoginWrap>
          <LoginText onClick={() => dispatch(TOGGLE_NEW_REGISTER())}>
            返回登入
          </LoginText>
        </>
      ) : (
        <>
          <LoginWrap $isFocusing={isFocusingLogin} onClick={nativeLogin}>
            登入
          </LoginWrap>
          <LoginText onClick={() => dispatch(TOGGLE_NEW_REGISTER())}>
            新任市長？點此註冊
          </LoginText>
        </>
      )}
      <DivideLine />
      <LoginWrap $isFocusing={isFocusingLogin} onClick={GoogleLogin}>
        <GoogleLogo src={googleLogo} />
        以Google登入
      </LoginWrap>
    </Wrap>
  );
};

type LoginElementsProps = {
  $isFocusing: boolean;
};

const Wrap = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  padding: 20px 10px;
  border-radius: 20px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  background: linear-gradient(#9dd7d9, #f2f2f2);
`;

const LoginWrap = styled.div<LoginElementsProps>`
  margin-top: 20px;
  font-size: 20px;
  font-weight: bold;
  color: #cc8159;
  border: 3px #cc8159 solid;
  border-radius: 50px;
  padding: 10px 30px;
  background-color: #f2d6af7e;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  width: 80%;
  cursor: pointer;
  &:hover {
    background-color: #f2d6af;
  }
`;

const floating = keyframes`
  0%{
    transform: translateY(0) translateX(0px);
  }
  25%{
    transform: translateY(-15px) translateX(-2px); 
  }
  50%{
    transform: translateY(0) translateX(0px);
  }
  75%{
    transform: translateY(-15px) translateX(2px);
  }
  100%{
    transform: translateY(0) translateX(0px);
  }
`;

const LoginSlogan = styled.img<LoginElementsProps>`
  margin-top: auto;
  width: 100%;
  display: block;
  animation: ${({ $isFocusing }) => ($isFocusing ? '4s ease infinite' : '')};
  animation-name: ${floating};
`;

const CityImage = styled.img`
  margin-top: auto;
  width: 100%;
  display: block;
`;

const InputWrap = styled.p`
  display: flex;
  margin-top: 20px;
  align-items: center;
  position: relative;
`;

const InputTitle = styled.p`
  color: #cc8159;
  padding-right: 10px;
`;

const InputIcon = styled(FontAwesomeIcon)`
  color: #cc8159;
  cursor: pointer;
  width: 20px;
  position: absolute;
  right: 10px;
`;

const LoginInput = styled.input`
  color: #cc8159;
  height: 36px;
  border-radius: 18px;
  padding: 10px 15px;
  font-size: 20px;
`;

const LoginText = styled.p`
  color: #cc8159;
  margin-top: 10px;
  cursor: pointer;
`;

const DivideLine = styled.div`
  width: 90%;
  border: #cc8159 1px solid;
  margin-top: 20px;
`;

const GoogleLogo = styled.img`
  max-width: 30px;
  display: block;
`;
