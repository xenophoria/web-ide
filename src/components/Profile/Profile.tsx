import React, { useEffect, useState, RefObject } from "react";
import { useDispatch, useSelector } from "react-redux";
import withStyles from "./styles";
import AssignmentIcon from "@material-ui/icons/Assignment";
import AddIcon from "@material-ui/icons/Add";
import SearchIcon from "@material-ui/icons/Search";

import Header from "../Header/Header";
import {
    getUserProjects,
    getUserProfile,
    uploadImage,
    getUserImageURL,
    addProject,
    deleteProject
} from "./actions";
import {
    selectUserProjects,
    selectUserProfile,
    selectUserImageURL,
    selectIsUserProfileOwner,
    selectProfileLinks
} from "./selectors";
import { get } from "lodash";
import {
    Button,
    Card,
    Typography,
    Link,
    Tabs,
    Tab,
    List,
    ListItem,
    ListItemAvatar,
    Avatar,
    ListItemText,
    Divider,
    Fab,
    FormControl,
    InputLabel,
    Input,
    InputAdornment,
    TextField
} from "@material-ui/core";
import CameraIcon from "@material-ui/icons/CameraAltOutlined";
import { push } from "connected-react-router";
import styled from "styled-components";
import { Gradient } from "./Gradient";
import { AccountCircle } from "@material-ui/icons";

const ProfileContainer = styled.div`
    display: grid;
    grid-template-columns: 1fr 250px 8fr;
    grid-template-rows: 30px 220px 1fr 100px;
    width: 100%;
    height: calc(100vh - 40px);
    background-color: black;
    ${Gradient}
`;

const IDContainer = styled(Card)`
    && {
        grid-row-start: 2;
        grid-row-end: 4;
        grid-column-start: 2;
        grid-column-end: 3;
        display: grid;
        grid-template-rows: 250px 1fr;
        grid-template-columns: 1fr;
        z-index: 2;
    }
`;

const DescriptionSection = styled.div`
    grid-row: 2;
    grid-column: 1;
    padding: 20px;
`;

const MainContent = styled.div`
    grid-row-start: 3;
    grid-row-end: 5;
    grid-column-start: 1;
    grid-column-end: 4;
    background: #dedede;
    box-shadow: 0 3px 10px 0px;
`;

const ProfilePictureContainer = styled.div`
    position: relative;
    grid-row: 1;
    grid-column: 1;
    z-index: 2;
`;

const ProfilePictureDiv = styled.div`
    width: 100%;
    height: 100%;
    position: absolute;
    z-index: 1;
    background: white;
`;

interface IUploadProfilePicture {
    imageHover: Boolean;
}

const UploadProfilePicture = styled.div<IUploadProfilePicture>`
    width: 100%;
    height: 30%;
    bottom: 0px;
    position: absolute;
    z-index: 2;
    background-color: #0000005c;
    display: grid;
    grid-template-rows: 1fr 1fr;
    grid-template-columns: 1fr;
    cursor: pointer;
    transition: opacity 0.3s linear;
    opacity: ${props => (props.imageHover ? 1 : 0)};
`;

const UploadProfilePictureText = styled.div`
    font-family: Arial, Helvetica, sans-serif;
    text-align: center;
    font-weight: bold;
    color: white;
    padding-top: 3px;
    grid-row: 1;
    grid-column: 1;
`;

const UploadProfilePictureIcon = styled.div`
    grid-row: 2;
    grid-column: 1;
    align-content: center;
    color: white;
    margin-left: auto;
    margin-right: auto;
`;

const ProfilePicture = styled.img`
    object-fit: cover;
`;

const NameSectionWrapper = styled.div`
    grid-row: 2;
    grid-column: 3;
    display: grid;
    grid-template-rows: 1fr 120px;
    grid-template-columns: 1fr;
`;
const NameSection = styled.div`
    grid-row: 2;
    grid-column: 1;
    color: white;
    padding: 20px;
`;

const ContentSection = styled.div`
    grid-row-start: 3;
    grid-row-end: 5;
    grid-column: 3;
    z-index: 2;
    padding: 0 20px;
    display: grid;
    grid-template-rows: 60px 50px 1fr;
    grid-template-columns: 1fr 250px;
`;

const ContentTabsContainer = styled.div`
    grid-row: 1;
    grid-column: 1;
`;

const ContentActionsContainer = styled.div`
    grid-row: 2;
    grid-column: 1;
`;

const AddFab = styled(Fab)`
    float: right;

    && {
        margin-top: 6px;
    }
`;

const ListContainer = styled.div`
    padding-top: 10px;
    grid-row: 3;
    grid-column: 1;
`;

const SearchBox = styled(TextField)`
    && {
        height: 20px;
    }
`;

const Profile = props => {
    const { classes } = props;
    const dispatch = useDispatch();
    const projects = useSelector(selectUserProjects);
    const profile = useSelector(selectUserProfile);
    const imageUrl = useSelector(selectUserImageURL);
    const isProfileOwner = useSelector(selectIsUserProfileOwner);
    const links = useSelector(selectProfileLinks);
    const [imageHover, setImageHover] = useState(false);
    const [selectedSection, setSelectedSection] = useState(0);
    let uploadRef: RefObject<HTMLInputElement>;
    uploadRef = React.createRef();
    useEffect(() => {
        const username = get(props, "match.params.username") || null;
        dispatch(getUserProjects());
        dispatch(getUserProfile(username));
        dispatch(getUserImageURL(username));
    }, [dispatch]);
    return (
        <div className={classes.root}>
            <Header showMenuBar={false} />
            <main>
                <ProfileContainer
                    colorA={"rgba(30, 30, 30, 1)"}
                    colorB={"rgba(40, 40, 40, 1)"}
                    colorC={"rgba(20, 20, 20, 1)"}
                >
                    <IDContainer>
                        <ProfilePictureContainer
                            onMouseEnter={() => setImageHover(true)}
                            onMouseLeave={() => setImageHover(false)}
                        >
                            <ProfilePictureDiv>
                                <ProfilePicture
                                    src={imageUrl}
                                    width={"100%"}
                                    height={"100%"}
                                    alt="User Profile"
                                />
                            </ProfilePictureDiv>
                            <input
                                type="file"
                                ref={uploadRef}
                                style={{ display: "none" }}
                                accept={"image/jpeg"}
                                onChange={e => {
                                    const file: File =
                                        get(e, "target.files.0") || null;
                                    dispatch(uploadImage(file));
                                }}
                            />
                            {isProfileOwner && (
                                <UploadProfilePicture
                                    onClick={() => {
                                        const input = uploadRef.current;
                                        input!.click();
                                    }}
                                    imageHover={imageHover}
                                >
                                    <UploadProfilePictureText>
                                        Upload New Image
                                    </UploadProfilePictureText>
                                    <UploadProfilePictureIcon>
                                        <CameraIcon />
                                    </UploadProfilePictureIcon>
                                </UploadProfilePicture>
                            )}
                        </ProfilePictureContainer>
                        <DescriptionSection>
                            <Typography variant="h5" component="h4">
                                Bio
                            </Typography>
                            <Typography
                                variant="body2"
                                component="p"
                                color="textSecondary"
                                gutterBottom
                            >
                                {profile.bio}
                            </Typography>
                            <Typography variant="h5" component="h4">
                                Links
                            </Typography>
                            <Link variant="body2" href={profile.link1}>
                                {profile.link1}
                            </Link>
                        </DescriptionSection>
                    </IDContainer>
                    <NameSectionWrapper>
                        <NameSection>
                            <Typography variant="h3" component="h3">
                                {profile.username}
                            </Typography>
                        </NameSection>
                    </NameSectionWrapper>
                    <MainContent></MainContent>
                    <ContentSection>
                        <ContentTabsContainer>
                            <Tabs
                                value={selectedSection}
                                onChange={(e, index) => {
                                    setSelectedSection(index);
                                }}
                                indicatorColor={"primary"}
                            >
                                <Tab label="Projects" />
                                <Tab label="Following" />
                                <Tab label="Other" />
                            </Tabs>
                        </ContentTabsContainer>

                        <ContentActionsContainer>
                            <SearchBox
                                id="input-with-icon-adornment"
                                label="Search"
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <SearchIcon />
                                        </InputAdornment>
                                    )
                                }}
                                variant="outlined"
                                margin="dense"
                            />

                            {isProfileOwner && (
                                <AddFab
                                    color="primary"
                                    variant="extended"
                                    aria-label="Add"
                                    size="medium"
                                    className={classes.margin}
                                    onClick={() => dispatch(addProject())}
                                >
                                    Create
                                    <AddIcon className={classes.extendedIcon} />
                                </AddFab>
                            )}
                        </ContentActionsContainer>

                        <ListContainer>
                            <List>
                                <ListItem alignItems="flex-start">
                                    <ListItemAvatar>
                                        <Avatar>
                                            <AssignmentIcon />
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary="909 Drum Machine Sketch"
                                        secondary={
                                            "Csound approximation of the Roland-909"
                                        }
                                    />
                                </ListItem>
                                <Divider variant="inset" component="li" />
                            </List>
                        </ListContainer>
                    </ContentSection>
                </ProfileContainer>
            </main>
        </div>
    );
};

export default withStyles(Profile);
