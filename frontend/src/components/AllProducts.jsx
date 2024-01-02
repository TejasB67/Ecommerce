import axios from "axios";
import { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import Product from "./Product";
import TopSlider from "./TopSlider";

function AllProduct() {
    const [products, setProducts] = useState([])
    const [totalPage, setTotalPage] = useState(0)
    const { catid } = useParams()
    const state = useSelector((state) => state);
    const [item, setItem] = useState({})
    const [qty, setQty] = useState(1)
    const dispatch = useDispatch()
    const history = useHistory()

    const [showDialog, setShowDialog] = useState("modal fade")
    const [display, setDisplay] = useState("none")

    const showModal = (prod) => {
        console.log("Child call parent")
        setShowDialog("modal fade show")
        setDisplay("block")
        setItem(prod)
    }

    const checkItem = (prodid) => {
        return state.cart.findIndex(x => x.prodid === prodid) < 0
    }

    const closeDialog = () => {
        setShowDialog("modal fade")
        setDisplay("none")
    }

    const loadDataFromServer = (page = 0, pagesize = 8) => {
        axios.get("http://localhost:5000/api/products/paginated?page=" + page + "&pagesize=" + pagesize)
            .then(resp => {
                console.log(resp.data.data.total)
                setProducts(resp.data.data.plist)
                setTotalPage(Math.ceil(resp.data.data.total / pagesize))
                console.log(products)
            })
    }

    useEffect(() => {
        console.log(catid)
        if (catid !== undefined) {
            axios.get("http://localhost:5000/api/products/cats/" + catid)
                .then(resp => {
                    console.log(resp.data)
                    setProducts(resp.data)
                    console.log(products)
                })
        }
        else {
            loadDataFromServer()
        }
    }, [catid])
    const addToCart = item => {
        if (sessionStorage.getItem("userid") == null) {
            alert("Please login first to buy product")
            history.push("/clogin")
        }
        else if (sessionStorage.getItem("role") !== "customer") {
            alert("Only customer can buy product")
        }
        else {
            if (checkItem(item.prodid)) {
                showModal()
                setDisplay("none")
                setShowDialog("modal fade")
                item.qty = qty
                dispatch({ type: 'AddItem', payload: item })
                alert("Item added to cart successfully")
            }
            else {
                alert("Item already in cart")
            }
        }
    }


    const handlePageClick = ({ selected: selectedPage }) => {
        loadDataFromServer(selectedPage)
    }

    return (
        <>
            <TopSlider />
            <div>
                <div className="container-fluid" style={{ width: "92%" }}>
                    <div className="card shadow bg-transparent text-black font-weight-bold">
                        <div className="card-body">
                            <ReactPaginate
                                previousLabel={"← Previous"}
                                nextLabel={"Next →"}
                                containerClassName={"pagination"}
                                pageCount={totalPage}
                                onPageChange={handlePageClick}
                                previousLinkClassName={"pagination__link"}
                                nextLinkClassName={"pagination__link"}
                                disabledClassName={"pagination__link--disabled"}
                                activeClassName={"pagination__link--active"} />
                            <div className="row">
                                {products.map(x => (
                                    <Product key={x.prodid} x={x} showModal={showModal} />
                                ))}
                            </div>

                        </div>
                    </div>
                    {display == "block" ? (
                        <div className={showDialog} style={{ zIndex: "1000", display: display }}>
                            <div className="modal-dialog">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h5>Add to Cart</h5>
                                        <button onClick={closeDialog} className="close">&times;</button>
                                    </div>
                                    <div className="modal-body">
                                        <div className="d-flex">
                                            <img src={"http://localhost:5000/" + item.photo} style={{ width: "200px" }} />
                                            <div className="ml-3">
                                                <h4 className="p-2 text-warning">{item.pname}</h4>
                                                <h5 className="px-2">About: {item.descr}</h5>
                                                <h5 className="px-2">Category: {item.category.catname}</h5>
                                                <h5 className="px-2">Seller: {item.sellerName}</h5>
                                                <h5 className="px-2">Price: &#8377; {item.price}</h5>
                                                <input type="number" min="1" value={qty} onChange={e => setQty(e.target.value)} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="modal-footer">
                                        <button onClick={e => addToCart(item)} className="btn btn-warning btn-sm">Add to Cart</button>
                                    </div>
                                </div>
                            </div>
                        </div>) : ""}
                </div>
                <footer className=" my-1 mx-2 py-2 bg-dark text-white">
                    <container>
                        <section>
                            <div className="row  py-1 px-2 text-start">
                                <div class="col-lg-3 col-md-6">
                                    <h5 class="text-white mb-4">Quick Links</h5>
                                    <a class="btn btn-link text-white-50" href="">About Us</a>
                                    <a class="btn btn-link text-white-50" href="">Contact Us</a>
                                    <a class="btn btn-link text-white-50" href="">Our Services</a>
                                    <a class="btn btn-link text-white-50" href="">Privacy Policy</a>
                                    <a class="btn btn-link text-white-50" href="">Terms & Condition</a>
                                </div>

                                <div className=" col-sm-12 col-md-4">
                                    <h3>Services</h3>
                                    <ul>
                                        <li>Ecommerce Website</li>
                                        <li>Customizable Shop</li>
                                        <li>Special Sale EveryMonth</li>
                                    </ul>
                                    <button>Youtube</button>
                                    <button>Instagram</button>
                                    <button>Twiter</button>
                                    <button>Facebook</button>
                                </div>
                                <div className=" col-sm-12 col-md-4">
                                    <h3>Contact Us</h3>
                                    <p>123 ATP Road, City, Country</p>
                                    <p>Email: info@example.com</p>
                                    <p>Phone: 123-456-7890</p>
                                </div>
                            </div>

                        </section>
                    </container>
                    <container>
                        <div class="container">
                            <div class="copyright">
                                <div class="row">
                                    <div class="col-md-6 text-center text-md-start mb-3 mb-md-0">
                                        &copy; <a class="border-bottom" href="https://freewebsitecode.com">ATP Kart</a>, All Right Reserved.

                                        Designed By <a class="border-bottom" href="https://freewebsitecode.com">Free Website Code</a>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </container>
                </footer>
            </div>
        </>
    )
}

export default AllProduct;