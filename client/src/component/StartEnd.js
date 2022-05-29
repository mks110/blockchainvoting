import React from "react";
import { Link } from "react-router-dom";

const StartEnd = (props) => {
  const btn = {
    display: "block",
    padding: "21px",
    margin: "7px",
    minWidth: "max-content",
    textAlign: "center",
    width: "333px",
    alignSelf: "center",
  };
  return (
    <div
      className="container-main"
      style={{ borderTop: "1px solid", marginTop: "0px" }}
    >
      {!props.elStarted ? (
        <>
          {/* display voting start */}
          {!props.elEnded ? (
            <>
              <div
                className="container-item attention"
                style={{ display: "block" }}
              >
                <h2>Jangan lupa untuk menambahkan kandidat.</h2>
                <p>
                  pergi ke{" "}
                  <Link
                    title="Add a new "
                    to="/addCandidate"
                    style={{
                      color: "black",
                      textDecoration: "underline",
                    }}
                  >
                    Tambah Kandidat
                  </Link>{" "}
                  page.
                </p>
              </div>
              <div className="container-item">
                <button type="submit" style={btn}>
                  Mulai Pemilihan {props.elEnded ? "Again" : null}
                </button>
              </div>
            </>
          ) : (
            <div className="container-item">
              <center>
                <p>Deploy ulang contract untuk melakukan pemilihan kembali</p>
              </center>
            </div>
          )}
          {props.elEnded ? (
            <div className="container-item">
              <center>
                <p>Pemilihan Telah Berakhir.</p>
              </center>
            </div>
          ) : null}
        </>
      ) : (
        <>
          <div className="container-item">
            <center>
              <p>Peilihan Telah Dimulai.</p>
            </center>
          </div>
          <div className="container-item">
            <button
              type="button"
              // onClick={this.endElection}
              onClick={props.endElFn}
              style={btn}
            >
              Selesai
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default StartEnd;
