import { useEffect, useState } from "react";

import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
import { Typography } from "@mui/material";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import Button from "@mui/material/Button";

import { Redirect } from "react-router-dom";
import { useHistory } from "react-router-dom";
import { useQuery } from "../providers/query-params-provider";
import { client } from "../clients/client";

import { useStateContext } from "../providers/state-provider";
import { useClimateProjects } from "../clients/climate-project-client";
import { useReports } from "../clients/report-client";
import { useAdmins } from "../clients/admin-client";
import { CustomToolbar } from "../components/custom-toolbar";
import { hasPermission } from "../utils/permission-utils";

import {
  CLIMATE_PROTECTION_CATEGORIES,
  CLIMATE_ADJUSTMENT_CATEGORIES,
  getDisplayNameAndCategoryFromFilterName,
} from "../constants";
import { useDeficiencies } from "../clients/deficiency-client";
import useDesktop from "../providers/use-desktop";

const dataGridStyling = {
  "& .MuiDataGrid-renderingZone": {
    maxHeight: "100px !important",
  },
  "& .MuiDataGrid-cell": {
    lineHeight: "unset !important",
    maxHeight: "100px !important",
    whiteSpace: "normal",
    display: "-webkit-box",
    cursor: "pointer",
  },
  "& .MuiDataGrid-row": {
    maxHeight: "100px !important",
  },
};

const getDisplayedText = (input) => {
  return input ? input : "-";
};

const getRounded = (number) => {
  return Math.round((Number(number) + Number.EPSILON) * 100000) / 100000;
};

const getDateAndTime = (dateString) => {
  const date = new Date(dateString);
  return date && date.getDate()
    ? date.toLocaleDateString("de-DE") +
        ", " +
        date.toLocaleTimeString("de-DE", {
          hour: "2-digit",
          minute: "2-digit",
        })
    : null;
};

const getDate = (dateString) => {
  if (!dateString) return null;

  const date = new Date(dateString);
  return date && date.getDate() ? date.toLocaleDateString("de-DE") : null;
};

const getLastChangerName = (report, admins) => {
  return report.lastModifiedBy && admins
    ? admins.filter((admin) => admin.id === report.lastModifiedBy)[0].username
    : null;
};

export function ListPage() {
  const matchesDesktop = useDesktop();
  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const [openedImage, setOpenedImage] = useState(0);
  const [imagesOfDeficiency, setImagesOfDeficiency] = useState([]);
  const { stateContext, setStateContext } = useStateContext();
  const { authToken, queryTrigger, adminPermissions } = stateContext;

  const query = useQuery();
  const history = useHistory();

  const perms = [];
  for (const perm of [
    { perm: "melder", permName: "Hifäller Projekte" },
    { perm: "klima", permName: "Klimaaktionsplan" },
    { perm: "maengel", permName: "Mängelmelder" },
  ]) {
    if (hasPermission(stateContext.adminPermissions, `${perm.perm}_perm`)) {
      perms.push(perm);
    }
  }
  const shownListCategory = query.get("kategorie") || perms[0]?.perm || null;

  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });

  const baseFiltering = new URLSearchParams({ state: "all" });

  const { admins } = useAdmins(authToken, queryTrigger, adminPermissions);
  const { reports } = useReports(authToken, queryTrigger, baseFiltering);
  const { climateProjects } = useClimateProjects(authToken, queryTrigger, baseFiltering);
  const { deficiencies } = useDeficiencies(authToken, queryTrigger, adminPermissions, paginationModel.page * 10);
  const [deficiencyCount, setDeficiencyCount] = useState(0);

  useEffect(() => {
    client
      .get("/defects/count", {
        headers: authToken
          ? {
              "x-access-token": authToken,
            }
          : null,
      })
      .then((response) => {
        setDeficiencyCount(response.data.count || 0);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const handleImageDialogOpen = () => {
    setOpenedImage(0);
    setImageDialogOpen(true);
  };

  const handleImageDialogClose = () => {
    setImageDialogOpen(false);
    setOpenedImage(0);
  };

  const handleCellClick = (params, event) => {
    if (params.id) {
      setStateContext((prevState) => ({
        ...prevState,
        previousPathname: "/meldungen",
      }));

      if (shownListCategory === "melder") {
        history.push({
          pathname: "melder",
          search: `?report=${params.id}&kategorie=hochbau&kategorie=tiefbau&kategorie=sonstiges&status=geplant&status=aktiv&status=archiv`,
        });
      } else if (shownListCategory === "klima") {
        const searchParams = new URLSearchParams();
        searchParams.append("zeithorizont", "kurzfristig");
        searchParams.append("zeithorizont", "mittelfristig");
        searchParams.append("zeithorizont", "langfristig");
        searchParams.append("zeithorizont", "archiv");
        CLIMATE_PROTECTION_CATEGORIES.forEach((category) =>
          searchParams.append(category.filterCategory, category.filterName),
        );
        CLIMATE_ADJUSTMENT_CATEGORIES.forEach((category) =>
          searchParams.append(category.filterCategory, category.filterName),
        );
        searchParams.append("klima-projekt", params.id);
        if (params.row.isAreaProject) {
          searchParams.append("ansicht", "standortuebergreifend");
        } else {
          searchParams.append("ansicht", "standortbezogen");
        }
        history.push({
          pathname: "klima",
          search: searchParams.toString(),
        });
      } else if (shownListCategory === "maengel") {
        if (params.row.img.length > 0) {
          setImagesOfDeficiency(params.row.img);
          handleImageDialogOpen(params.row.img[0]);
        } else console.warn("No images for deficiency with id", params.id);
      }
    }
  };
  const melderColumns = [
    { field: "id", headerName: "ID", flex: 1 },
    { field: "title", headerName: "Titel", flex: 1 },
    { field: "location", headerName: "Position", flex: 2 },
    { field: "county", headerName: "Stadtteil", flex: 3 },
    { field: "category", headerName: "Kategorie", flex: 3 },
    {
      field: "description",
      headerName: "Beschreibung",
      flex: 6,
    },
    {
      field: "status",
      headerName: "Sichtbarkeit",
      flex: 2,
      renderCell: (params) => {
        return <div>{params.value === "active" ? "sichtbar" : "ausgeblendet"}</div>;
      },
    },

    {
      field: "img",
      headerName: "Bilder",
      flex: 1,
      renderCell: (params) => {
        return params.value && params.value.length > 0 ? params.value.length : "-";
      },
    },

    {
      field: "costs",
      headerName: "Kosten",
      flex: 2,
    },
    {
      field: "startDate",
      headerName: "Start",
      flex: 2,
    },
    {
      field: "endDate",
      headerName: "Ende",
      flex: 2,
    },
    {
      field: "createdAt",
      headerName: "Erstellt am",
      flex: 2,
    },
    {
      field: "updatedAt",
      headerName: "Bearbeitet am",
      flex: 2,
    },
    {
      field: "comment",
      headerName: "Kommentar",
      flex: 2,
    },
    {
      field: "adminComment",
      headerName: "Statusmeldung",
      flex: 2,
    },
    {
      field: "lastModifiedBy",
      headerName: "Bearbeiter",
      flex: 2,
    },
  ];

  const climateColumns = [
    { field: "id", headerName: "ID", flex: 1 },
    { field: "title", headerName: "Titel", flex: 1 },
    { field: "location", headerName: "Position/Gebiet", flex: 2 },
    {
      field: "category",
      headerName: "Kategorie",
      flex: 2,
    },
    {
      field: "subcategory",
      headerName: "Subkategorie",
      flex: 2,
    },
    {
      field: "description",
      headerName: "Beschreibung",
      flex: 6,
    },
    {
      field: "public",
      headerName: "Sichtbarkeit",
      flex: 2,
      renderCell: (params) => {
        return <div>{params.value ? "sichtbar" : "ausgeblendet"}</div>;
      },
    },
    {
      field: "costs",
      headerName: "Kosten",
      flex: 2,
    },
    {
      field: "responsible",
      headerName: "Zuständiger Fachbereich",
      flex: 2,
    },
    {
      field: "img",
      headerName: "Bilder",
      flex: 1,
      renderCell: (params) => {
        return params.value && params.value.length > 0 ? params.value.length : "-";
      },
    },
    {
      field: "startDate",
      headerName: "Start",
      flex: 2,
    },
    {
      field: "endDate",
      headerName: "Ende",
      flex: 2,
    },
    {
      field: "createdAt",
      headerName: "Erstellt am",
      flex: 2,
    },
    {
      field: "updatedAt",
      headerName: "Bearbeitet am",
      flex: 2,
    },
  ];

  const deficiencyColumns = [
    { field: "id", headerName: "ID", flex: 1 },
    { field: "location", headerName: "Position", flex: 2 },
    { field: "category", headerName: "Kategorie", flex: 2 },
    { field: "description", headerName: "Beschreibung", flex: 6 },
    { field: "mail", headerName: "Mail", flex: 2 },
    { field: "phone", headerName: "Telefon", flex: 2 },
    {
      field: "img",
      headerName: "Bilder",
      flex: 1,
      renderCell: (params) => {
        return params.value && params.value.length > 0 ? params.value.length : "-";
      },
    },
    { field: "createdAt", headerName: "Erstellt am", flex: 2 },
    { field: "updatedAt", headerName: "Bearbeitet am", flex: 2 },
  ];

  const melderRows =
    reports && reports.length > 0
      ? reports.map((report) => {
          return {
            id: report.id,
            title: getDisplayedText(report.title),
            location: getRounded(report.location[0].lat) + ", " + getRounded(report.location[0].lng),
            county: getDisplayedText(report.county),
            category: report.category,
            description: getDisplayedText(report.description),
            costs: getDisplayedText(report.costs),
            img: report.imgPath,
            status: report.status,
            startDate: getDisplayedText(getDate(report.startDate)),
            endDate: getDisplayedText(getDate(report.endDate)),
            createdAt: getDisplayedText(getDateAndTime(report.createdAt)),
            updatedAt: getDisplayedText(getDateAndTime(report.updatedAt)),
            comment: getDisplayedText(report.comment),
            adminComment: getDisplayedText(report.adminComment),
            lastModifiedBy: getDisplayedText(getLastChangerName(report, admins)),
          };
        })
      : [];

  const klimaRows =
    climateProjects && climateProjects.length > 0
      ? climateProjects.map((project) => {
          const isAreaProject = project.locationText || !project.location;
          const { displayName, category } = getDisplayNameAndCategoryFromFilterName(project.category);

          return {
            id: project.id,
            title: getDisplayedText(project.title),
            isAreaProject: isAreaProject,
            location: isAreaProject
              ? getDisplayedText(project.locationText)
              : getRounded(project.location?.[0]?.lat) + ", " + getRounded(project.location?.[0]?.lng),
            category: category,
            subcategory: displayName,
            description: getDisplayedText(project.description),
            costs: getDisplayedText(project.costs),
            responsible: getDisplayedText(project.responsible),
            img: project.imgPath,
            public: project.public,
            startDate: getDisplayedText(getDate(project.startDate)),
            endDate: getDisplayedText(getDate(project.endDate)),
            createdAt: getDisplayedText(getDateAndTime(project.createdAt)),
            updatedAt: getDisplayedText(getDateAndTime(project.updatedAt)),
          };
        })
      : [];

  const deficiencyRows =
    deficiencies && deficiencies.length > 0
      ? deficiencies.map((deficiency) => {
          return {
            id: deficiency.id,
            location: deficiency.location?.lat
              ? getRounded(deficiency.location.lat) + ", " + getRounded(deficiency.location.lng)
              : Object.entries(deficiency.location || {})
                  .map(([key, value]) => `${key}: ${value}`)
                  .join(", "),
            category: getDisplayedText(deficiency.category),
            description: getDisplayedText(deficiency.description),
            mail: getDisplayedText(deficiency.mail),
            phone: getDisplayedText(deficiency.phone),
            img: deficiency.imgPath,
            createdAt: getDisplayedText(getDateAndTime(deficiency.createdAt)),
            updatedAt: getDisplayedText(getDateAndTime(deficiency.updatedAt)),
          };
        })
      : [];

  const rows =
    shownListCategory === "melder"
      ? melderRows
      : shownListCategory === "klima"
      ? klimaRows
      : shownListCategory === "maengel"
      ? deficiencyRows
      : [];
  const columns =
    shownListCategory === "melder"
      ? melderColumns
      : shownListCategory === "klima"
      ? climateColumns
      : shownListCategory === "maengel"
      ? deficiencyColumns
      : [];

  if (!authToken || !shownListCategory) return <Redirect to="/" />;

  return (
    <>
      <Box sx={{ width: "100%", height: "100%", padding: 3 }}>
        <>
          <Typography sx={{ paddingBottom: 3 }} variant="h5">
            Meldungen
          </Typography>
          {perms.length > 1 ? (
            <Box sx={{ minWidth: 120 }}>
              <FormControl size="small" sx={{ marginBottom: 1 }}>
                <InputLabel id="label">Meldungskategorie</InputLabel>
                <Select
                  labelId="label"
                  id="id"
                  value={shownListCategory}
                  label="Meldungskategorie"
                  onChange={(e) => {
                    history.push({
                      pathname: "meldungen",
                      search: `?kategorie=${e.target.value}`,
                    });
                  }}
                >
                  {perms.map((perm) => {
                    return (
                      <MenuItem key={perm.perm} value={perm.perm}>
                        {perm.permName}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
            </Box>
          ) : null}
          <div style={{ height: "90%", width: "100%" }}>
            {shownListCategory === "maengel" ? (
              <DataGrid
                paginationMode="server"
                paginationModel={paginationModel}
                onPaginationModelChange={setPaginationModel}
                loading={!deficiencies}
                rowCount={deficiencyCount}
                rows={rows}
                columns={[...columns]}
                autoPageSize={true}
                sx={dataGridStyling}
                slots={{ toolbar: CustomToolbar }}
                onCellClick={handleCellClick}
                initialState={{
                  columns: {
                    columnVisibilityModel: {
                      comment: false,
                      adminComment: false,
                      lastModifiedBy: false,
                    },
                  },
                }}
              />
            ) : shownListCategory !== null ? (
              <DataGrid
                paginationMode="client"
                rows={rows}
                columns={[...columns]}
                autoPageSize={true}
                sx={dataGridStyling}
                slots={{ toolbar: CustomToolbar }}
                onCellClick={handleCellClick}
                initialState={{
                  columns: {
                    columnVisibilityModel: {
                      comment: false,
                      adminComment: false,
                      lastModifiedBy: false,
                    },
                  },
                }}
              />
            ) : null}
          </div>
        </>
      </Box>

      <Dialog
        fullScreen={matchesDesktop === false}
        maxWidth="xl"
        open={imageDialogOpen}
        onClose={handleImageDialogClose}
      >
        <DialogContent
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <img src={process.env.REACT_APP_BASE_URL + imagesOfDeficiency[openedImage]} alt={"meldungsbild-groß"} />
        </DialogContent>
        <DialogActions sx={{ display: "flex", justifyContent: "center" }}>
          {imagesOfDeficiency.length > 1 && (
            <Button
              onClick={() => {
                if (openedImage > 0) {
                  setOpenedImage(openedImage - 1);
                }
              }}
              sx={{ paddingBottom: 1 }}
              disabled={openedImage === 0}
            >
              Zurück
            </Button>
          )}
          <Button onClick={handleImageDialogClose} sx={{ paddingBottom: 1 }}>
            Schließen
          </Button>
          {imagesOfDeficiency.length > 1 && (
            <Button
              onClick={() => {
                if (openedImage < imagesOfDeficiency.length - 1) {
                  setOpenedImage(openedImage + 1);
                }
              }}
              sx={{ paddingBottom: 1 }}
              disabled={openedImage === imagesOfDeficiency.length - 1}
            >
              Weiter
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </>
  );
}
