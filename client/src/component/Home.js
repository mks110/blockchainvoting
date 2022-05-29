// Node modules
import React, { Component } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";

// Components
import Navbar from "./Navbar/Navigation";
import NavbarAdmin from "./Navbar/NavigationAdmin";
import UserHome from "./UserHome";
import StartEnd from "./StartEnd";
import ElectionStatus from "./ElectionStatus";

// Contract
import getWeb3 from "../getWeb3";
import Election from "../contracts/Election.json";

// CSS
import "./Home.css";

// const buttonRef = React.createRef();
export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ElectionInstance: undefined,
      account: null,
      web3: null,
      isAdmin: false,
      elStarted: false,
      elEnded: false,
      elDetails: {},
    };
  }

  // refresh halaman
  componentDidMount = async () => {
    if (!window.location.hash) {
      window.location = window.location + "#loaded";
      window.location.reload();
    }
    try {
      // Get network provider and web3 .
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // get contract.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = Election.networks[networkId];
      const instance = new web3.eth.Contract(
        Election.abi,
        deployedNetwork && deployedNetwork.address
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      
      this.setState({
        web3: web3,
        ElectionInstance: instance,
        account: accounts[0],
      });

      const admin = await this.state.ElectionInstance.methods.getAdmin().call();
      if (this.state.account === admin) {
        this.setState({ isAdmin: true });
      }

      // Get voting start and end values
      const start = await this.state.ElectionInstance.methods.getStart().call();
      this.setState({ elStarted: start });
      const end = await this.state.ElectionInstance.methods.getEnd().call();
      this.setState({ elEnded: end });

      // Getting voting details from the contract
      const adminName = await this.state.ElectionInstance.methods
        .getAdminName()
        .call();
      const adminEmail = await this.state.ElectionInstance.methods
        .getAdminEmail()
        .call();
      const adminTitle = await this.state.ElectionInstance.methods
        .getAdminTitle()
        .call();
      const electionTitle = await this.state.ElectionInstance.methods
        .getElectionTitle()
        .call();
      const organizationTitle = await this.state.ElectionInstance.methods
        .getOrganizationTitle()
        .call();

      this.setState({
        elDetails: {
          adminName: adminName,
          adminEmail: adminEmail,
          adminTitle: adminTitle,
          electionTitle: electionTitle,
          organizationTitle: organizationTitle,
        },
      });
    } catch (error) {
      // error .
      alert(
        `Gagal Mendeteksi Web3. Tolong Install Metamask terlebih dahulu`
      );
      console.error(error);
    }
  };
  // end voting
  endElection = async () => {
    await this.state.ElectionInstance.methods
      .endElection()
      .send({ from: this.state.account, gas: 1000000 });
    window.location.reload();
  };
  // register and start voting
  registerElection = async (data) => {
    await this.state.ElectionInstance.methods
      .setElectionDetails(
        data.adminFName.toLowerCase() + " " + data.adminLName.toLowerCase(),
        data.adminEmail.toLowerCase(),
        data.adminTitle.toLowerCase(),
        data.electionTitle.toLowerCase(),
        data.organizationTitle.toLowerCase()
      )
      .send({ from: this.state.account, gas: 1000000 });
    window.location.reload();
  };

  render() {
    if (!this.state.web3) {
      return (
        <>
          <Navbar />
          <center>Loading Web3, accounts, and contract...</center>
        </>
      );
    }
    return (
      <>
        {this.state.isAdmin ? <NavbarAdmin /> : <Navbar />}
        <div className="container-main">
          <div className="container-item center-items info">
            Token Akun Anda: {this.state.account}
          </div>
          {!this.state.elStarted & !this.state.elEnded ? (
            <div className="container-item info">
              <center>
                <h3>Pemilihan belum diselenggarakan</h3>
                {this.state.isAdmin ? (
                  <p>Silahkan atur pelaksanaan pemilihan</p>
                ) : (
                  <p>Please wait..</p>
                )}
              </center>
            </div>
          ) : null}
        </div>
        {this.state.isAdmin ? (
          <>
            <this.renderAdminHome />
          </>
        ) : this.state.elStarted ? (
          <>
            <UserHome el={this.state.elDetails} />
          </>
        ) : !this.state.isElStarted && this.state.isElEnded ? (
          <>
            <div className="container-item attention">
              <center>
                <h3>Pemilihan telah berakhir</h3>
                <br />
                <Link
                  to="/Results"
                  style={{ color: "black", textDecoration: "underline" }}
                >
                  Lihat Hasil
                </Link>
              </center>
            </div>
          </>
        ) : null}
      </>
    );
  }

  renderAdminHome = () => {
    const EMsg = (props) => {
      return <span style={{ color: "tomato" }}>{props.msg}</span>;
    };

    const AdminHome = () => {
      // tampilan home admin
      const {
        handleSubmit,
        register,
        formState: { errors },
      } = useForm();

      const onSubmit = (data) => {
        this.registerElection(data);
      };

      return (
        <div>
          <form onSubmit={handleSubmit(onSubmit)}>
            {!this.state.elStarted & !this.state.elEnded ? (
              <div className="container-main">
                {/* about-admin */}
                <div className="about-admin">
                  <h3>Pendaftaran Admin</h3>
                  <div className="container-item center-items">
                    <div>
                      <label className="label-home">
                        Nama Lengkap{" "}
                        {errors.adminFName && <EMsg msg="*required" />}
                        <input
                          className="input-home"
                          type="text"
                          placeholder="First Name"
                          {...register("adminFName", {
                            required: true,
                          })}
                        />
                        <input
                          className="input-home"
                          type="text"
                          placeholder="Last Name"
                          {...register("adminLName")}
                        />
                      </label>

                      <label className="label-home">
                        Email{" "}
                        {errors.adminEmail && (
                          <EMsg msg={errors.adminEmail.message} />
                        )}
                        <input
                          className="input-home"
                          placeholder="cth. you@example.com"
                          name="adminEmail"
                          {...register("adminEmail", {
                            required: "*Required",
                            pattern: {
                              value: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/, // email validation using RegExp
                              message: "*Invalid",
                            },
                          })}
                        />
                      </label>

                      <label className="label-home">
                        Deskripsi Jabatan{" "}
                        {errors.adminTitle && <EMsg msg="*required" />}
                        <input
                          className="input-home"
                          type="text"
                          placeholder="cth. Penyelenggara "
                          {...register("adminTitle", {
                            required: true,
                          })}
                        />
                      </label>
                    </div>
                  </div>
                </div>
                {/* about-election */}
                <div className="about-election">
                  <h3>Pendaftaran Pemilihan</h3>
                  <div className="container-item center-items">
                    <div>
                      <label className="label-home">
                        Judul Pemilihan{" "}
                        {errors.electionTitle && <EMsg msg="*required" />}
                        <input
                          className="input-home"
                          type="text"
                          placeholder="cth. Pemilihan Kepala Desa"
                          {...register("electionTitle", {
                            required: true,
                          })}
                        />
                      </label>
                      <label className="label-home">
                        Lokasi{" "}
                        {errors.organizationName && <EMsg msg="*required" />}
                        <input
                          className="input-home"
                          type="text"
                          placeholder="Provinsi/ Kota/ Kabupaten/ Desa"
                          {...register("organizationTitle", {
                            required: true,
                          })}
                        />
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            ) : this.state.elStarted ? (
              <UserHome el={this.state.elDetails} />
            ) : null}
            <StartEnd
              elStarted={this.state.elStarted}
              elEnded={this.state.elEnded}
              endElFn={this.endElection}
            />
            <ElectionStatus
              elStarted={this.state.elStarted}
              elEnded={this.state.elEnded}
            />
          </form>
        </div>
      );
    };
    return <AdminHome />;
  };
}
