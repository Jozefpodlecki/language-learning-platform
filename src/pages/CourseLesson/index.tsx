import * as actions from "actions";
import { useDispatch } from "react-redux";
import { useSelector } from "hooks/useSelector";
import React, {
    ChangeEvent,
    FunctionComponent,
    useEffect,
    useRef,
    useState,
} from "react";
import * as d3 from "d3";
import { Dataset } from "models/dataset";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { getCourseAsync, getCourseDatasetAsync } from "api";
import { useHistory, useParams } from "react-router";
import Loader from "react-loader-spinner";
import Navbar from "../Navbar";
import style from "./index.scss";
import _data from "./data_network.json";

const width = 800;
const height = 600;

const CourseLesson: FunctionComponent = () => {
    const {
        pages: {
            course: { course },
        },
    } = useSelector((state) => state);

    const dispatch = useDispatch();
    const { courseId } = useParams<{
        courseId: string;
    }>();
    const svgRef = useRef<SVGSVGElement>();
    const history = useHistory();
    const [{ value, items, pageSize, page }, setState] = useState({
        value: "",
        items: [],
        pageSize: 30,
        page: 0,
    });

    useEffect(() => {
        if (course.isLoading === true) {
            getCourseAsync(courseId).then((course) => {
                dispatch(actions.getCourse.success(course));
            });

            return;
        }

        if (course.id !== courseId) {
            getCourseAsync(courseId).then((course) => {
                dispatch(actions.getCourse.success(course));
            });
            return;
        }

    }, [course]);

    useEffect(() => {
        if (course.isLoading === true) {
            return;
        }
       
        const svg = d3.select(svgRef.current);

        svg
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .attr("transform", "translate(10, 10)");

        const data = _data;
        
        const link = svg
            .selectAll("line")
            .data(data.links)
            .enter()
            .append("line")
            .attr("class", style.nodeLink)
        
        const node = svg
            .selectAll("ellipse")
            .data(data.nodes)
            .enter()
            .append("g")
            .attr("class", style.node)
            .on("mouseover", function() {
                d3.select(this).classed(style.nodeHover, true);
              })
            .on("mouseout", function() {
                 d3.select(this).classed(style.nodeHover, false);
            })
            .on("click", (event: any, data: any) => {
                
            })
 
        const circle = node
            .append("ellipse")
            .attr("rx", 120)
            .attr("ry", 60)
            .attr("class", style.nodeCircle)
            

        const text = node
            .append("text")
            .attr("class", style.nodeText)
            .text((d) => d.name)
            

        const simulation = d3.forceSimulation(data.nodes as any)
            .force("link", d3.forceLink()
                .id((d: any) => d.id)
                .links(data.links)
                .distance(200)
            )
            .force("charge", d3.forceManyBody().strength(-1500))
            .force("center", d3.forceCenter(width / 2, height / 2))
            .on("end", ticked); 

        function ticked() {
            link
                .attr("x1", (d: any) => d.source.x )
                .attr("y1", (d: any) => d.source.y )
                .attr("x2", (d: any) => d.target.x )
                .attr("y2", (d: any) => d.target.y );
        
            text
                .attr("x", (d: any) => d.x)
                .attr("y", (d: any) => d.y - 6);

            circle
                .attr("cx", (d: any) => d.x + 12)
                .attr("cy", (d: any) => d.y - 12);
        }
    }, [course, svgRef.current])
   
    if (course.isLoading === true) {
        return (
            <div>
                <Loader
                    type="ThreeDots"
                    color="black"
                    width={200}
                    height={200}
                />
            </div>
        );
    }

    return (
        <div>
            <Navbar />
            <div className={style.header}>
                <Link className={style.back} to="/">
                    <FontAwesomeIcon icon={faArrowLeft} />
                    <div className={style.backTitle}>Back</div>
                </Link>
                <div className={style.title}>{course.name}</div>
            </div>
            <div>
                <svg ref={svgRef}/>
            </div>
        </div>
    );
};

export default CourseLesson;
