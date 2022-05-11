import React, { useEffect, useState } from "react";
import { BiWinkTongue } from "react-icons/bi";
import { FaGithubAlt } from "react-icons/fa";
import { RiLockPasswordLine } from "react-icons/ri";
import { AiOutlineMail } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import {
  Modal,
  useModal,
  Input,
  Button,
  Text,
  Row,
  Checkbox,
} from "@nextui-org/react";
import { ToastContainer, toast } from "react-toastify";

import confetti from "canvas-confetti";
import bgVideo from "../assets/bg.mp4";
import logo from "../assets/logowhite.png";

import {
  getCurrentUser,
  githubLogin,
  login,
  register,
} from "../utils/APIUtils";
import {
  ACCESS_TOKEN,
  AUTHORIZE_URL,
  CLIENT_ID,
  REDIRECT_URI,
} from "../utils/constants";
import { uuid } from "../utils";

const Login = () => {
  const [flag, setFlag] = useState(false);
  const [nativeVisible, setNativeVisible] = useState(false);
  const [regModal, setRegModal] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [regUserInfo, setRegUserInfo] = useState({
    username: "",
    password: "",
    email: "",
    nickname: "",
  });
  const navigate = useNavigate();

  const { setVisible, bindings } = useModal();

  useEffect(() => {
    // github 登陆的重定向
    const url = window.location.href;

    const hasCode = url.includes("?code=");

    if (hasCode) {
      const code = url.split("?code=")[1];
      console.log(code);
      githubLogin(code)
        .then((resp) => {
          console.log(resp);
          localStorage.setItem(ACCESS_TOKEN, resp.accessToken);
          loadCurrentUser();
        })
        .catch((err) => {
          console.log(err);
          toast("🦄 请求超时！请重试", {
            position: "top-center",
            autoClose: 3000,
            hideProgressBar: false,
            progress: undefined,
          });
        });
    } else {
      // 用于校验一次token信息
      loadCurrentUser();
    }
  }, []);

  const randomInRange = (min, max) => {
    return Math.random() * (max - min) + min;
  };

  const firework = () => {
    var duration = 5 * 1000;
    var animationEnd = Date.now() + duration;
    var defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    var interval = setInterval(function () {
      var timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      var particleCount = 50 * (timeLeft / duration);
      // since particles fall down, start a bit higher than random
      confetti(
        Object.assign({}, defaults, {
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        })
      );
      confetti(
        Object.assign({}, defaults, {
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        })
      );
    }, 250);
  };

  const handleNativeLogin = () => {
    confetti({
      angle: randomInRange(55, 125),
      spread: randomInRange(50, 70),
      particleCount: randomInRange(50, 100),
      origin: { y: 0.6 },
    });

    setNativeVisible(true);
  };

  const handleGithubLogin = () => {
    firework();
    window.location.href = `${AUTHORIZE_URL}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}`;
  };

  const closeHandler = () => {
    setNativeVisible(false);
    setRegModal(false);
  };

  const handleLoginModal = () => {
    console.log(usernameOrEmail + ": " + password + ": " + rememberMe);
    const loginRequest = { usernameOrEmail, password, rememberMe };
    let msg = "";
    login(loginRequest)
      .then((response) => {
        localStorage.setItem(ACCESS_TOKEN, response.accessToken);
        msg = "登陆成功";
        loadCurrentUser();
        setNativeVisible(false);
      })
      .catch((error) => {
        msg = error.message;
      })
      .finally(() => {
        toast("🦄 " + msg, {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          progress: undefined,
        });
      });
  };

  const loadCurrentUser = () => {
    getCurrentUser()
      .then((response) => {
        localStorage.setItem("user", JSON.stringify(response));
        navigate("/");
      })
      .catch((error) => {
        localStorage.clear();
        console.log(error);
      });
  };

  const handleRegister = () => {
    confetti({
      angle: randomInRange(55, 125),
      spread: randomInRange(50, 70),
      particleCount: randomInRange(50, 100),
      origin: { y: 0.6 },
    });
    setRegModal(true);
  };

  const handleRegisterModal = () => {
    setRegUserInfo({
      ...regUserInfo,
      nickname: "Tesla" + uuid(),
    });
    let msg = "";
    register(regUserInfo)
      .then((response) => {
        console.log(response);
        msg = "注册成功, 请去登陆！";
        setRegModal(false);
      })
      .catch((error) => {
        msg = error.message;
        console.log(msg);
      })
      .finally(() => {
        toast("🦄 " + msg, {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          progress: undefined,
        });
      });
  };

  const handleRegInputChange = (event) => {
    const target = event.target;
    const inputName = target.name;
    const inputValue = target.value;

    setRegUserInfo({
      ...regUserInfo,
      [inputName]: inputValue,
    });
  };

  return (
    <div className="flex justify-start items-center flex-col h-screen">
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <div className=" relative w-full h-full">
        <video
          src={bgVideo}
          type="video/mp4"
          loop
          controls={false}
          muted
          autoPlay
          className="w-full h-full object-cover"
        />

        <div className="absolute flex flex-col justify-center items-center top-0 right-0 left-0 bottom-0 bg-blackOverlay">
          <div className="p-5">
            <img src={logo} width="130px" alt="Tesla" />
          </div>
          {/* README */}
          <Button auto shadow disabled={flag} onClick={() => setVisible(true)}>
            README
          </Button>

          {/* 登陆按钮 */}
          <Button
            disabled={!flag}
            size="lg"
            rounded
            onClick={handleNativeLogin}
            shadow
            className="mt-4"
          >
            <BiWinkTongue className="mr-4" /> Sign in
          </Button>

          <Button
            disabled={!flag}
            size="lg"
            rounded
            onClick={handleRegister}
            shadow
            className="mt-4"
          >
            <BiWinkTongue className="mr-4" /> Sign Up
          </Button>

          <Button
            size="lg"
            rounded
            shadow
            disabled={!flag}
            onClick={handleGithubLogin}
            className="mt-6"
          >
            <FaGithubAlt className="mr-4" /> Sign in with Github
          </Button>

          {/* 注册 */}
          <Modal
            closeButton
            scroll
            aria-labelledby="modal-title"
            open={regModal}
            onClose={closeHandler}
          >
            <Modal.Header>
              <Text id="modal-title" size={18}>
                Welcome to{" "}
                <Text b size={18}>
                  Sharing By Tesla
                </Text>
              </Text>
            </Modal.Header>
            <Modal.Body>
              <Input
                clearable
                bordered
                fullWidth
                label="Username"
                size="lg"
                name="username"
                value={regUserInfo.username}
                onChange={(e) => handleRegInputChange(e)}
              />
              <Input
                clearable
                bordered
                fullWidth
                size="lg"
                label="Email"
                name="email"
                value={regUserInfo.email}
                onChange={(e) => handleRegInputChange(e)}
              />
              <Input
                clearable
                bordered
                fullWidth
                size="lg"
                label="Password"
                name="password"
                value={regUserInfo.password}
                onChange={(e) => handleRegInputChange(e)}
              />
            </Modal.Body>
            <Modal.Footer>
              <Button auto flat color="error" onClick={closeHandler}>
                Close
              </Button>
              <Button
                auto
                style={{ color: "#14b8a6" }}
                onClick={handleRegisterModal}
              >
                Sign Up
              </Button>
            </Modal.Footer>
          </Modal>
          {/*  协议 */}
          <Modal
            scroll
            width="600px"
            aria-labelledby="modal-title"
            aria-describedby="modal-description"
            {...bindings}
          >
            <Modal.Header>
              <Text id="modal-title" size={18}>
                关于此站点相关的信息
              </Text>
            </Modal.Header>
            <Modal.Body>
              <Text id="modal-description">No Sex By Tesla</Text>
            </Modal.Body>
            <Modal.Footer>
              <Button auto flat color="error" onClick={() => setVisible(false)}>
                Close
              </Button>
              <Button
                style={{ color: "#14b8a6" }}
                auto
                onClick={() => {
                  setVisible(false);
                  setFlag(true);
                }}
              >
                Agree
              </Button>
            </Modal.Footer>
          </Modal>
          {/* 登陆 */}
          <Modal
            closeButton
            scroll
            aria-labelledby="modal-title"
            open={nativeVisible}
            onClose={closeHandler}
          >
            <Modal.Header>
              <Text id="modal-title" size={18}>
                Welcome to{" "}
                <Text b size={18}>
                  Sharing By Tesla
                </Text>
              </Text>
            </Modal.Header>
            <Modal.Body>
              <Input
                clearable
                bordered
                fullWidth
                aria-label="UsernameOrEmail"
                size="lg"
                placeholder="UsernameOrEmail"
                contentLeft={<AiOutlineMail />}
                value={usernameOrEmail}
                onChange={(e) => setUsernameOrEmail(e.target.value)}
              />
              <Input
                clearable
                bordered
                fullWidth
                aria-label="Password"
                size="lg"
                placeholder="Password"
                contentLeft={<RiLockPasswordLine />}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Row justify="space-between">
                <Checkbox onChange={() => setRememberMe(!rememberMe)}>
                  <Text size={14}>Remember me (save 7 days)</Text>
                </Checkbox>
                <Text size={14}>Forgot password?</Text>
              </Row>
            </Modal.Body>
            <Modal.Footer>
              <Button auto flat color="error" onClick={closeHandler}>
                Close
              </Button>
              <Button
                auto
                style={{ color: "#14b8a6" }}
                onClick={handleLoginModal}
              >
                Sign in
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default Login;
