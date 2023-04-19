import { Grid } from "@mui/material";
import { useTheme } from "@emotion/react";

import useDesktop from "../../providers/use-desktop";
import { CATEGORIES } from "../../constants";
import { ImageCard } from "../../components/info-components/image-card";

import sonstigesLight from "../../assets/images/categories/Cat_sonstiges_light.svg";
import sonstigesDark from "../../assets/images/categories/Cat_sonstiges_dark.svg";

export function BuildingFAQ() {
  const matchesDesktop = useDesktop();
  const theme = useTheme();

  const categories = [];

  CATEGORIES.forEach((category) => {
    categories.push({
      title: category.name,
      description: category.description,
      img:
        category.name === "Sonstiges"
          ? theme.palette.mode === "light"
            ? sonstigesLight
            : sonstigesDark
          : category.img,
    });
  });

  return (
    <div>
      <Grid container spacing={matchesDesktop ? 7 : 3}>
        <Grid item md={12} lg={12} xl={12}>
          <div>
            <Grid container spacing={7}>
              {categories.map((category, index) => {
                return (
                  <Grid
                    item
                    lg={6}
                    md={6}
                    sm={6}
                    xs={12}
                    sx={{ display: "flex", justifyContent: "center" }}
                    key={`categories${index}`}
                  >
                    <ImageCard img={category.img} title={category.title} description={category.description} />
                  </Grid>
                );
              })}
            </Grid>
          </div>
        </Grid>
      </Grid>
    </div>
  );
}
