import { Group, Title, ActionIcon, Select, TextInput, Button } from "@mantine/core";

import { useDebouncedValue, useWindowScroll } from "@mantine/hooks";

import { IconMoonStars, IconSun, IconSearch } from "@tabler/icons-react";

import { AnimatePresence, motion } from "framer-motion";

import { useLocation } from "react-router-dom";

import { useUIStore } from "../store/useUIStore";

const regions = ["All", "Africa", "Americas", "Asia", "Europe", "Oceania"];



const populationOptions = [
  { value: "none", label: "Population" },

  { value: "highest", label: "Highest Pop" },

  { value: "lowest", label: "Lowest Pop" },
];

export function Navbar() {
  const location = useLocation();

  const [scroll] = useWindowScroll();

  const searchTerm = useUIStore((state) => state.searchTerm);

  const region = useUIStore((state) => state.region);



  const populationOrder = useUIStore((state) => state.populationOrder);

  const hoveredCountry = useUIStore((state) => state.hoveredCountry);

  const selectedCountry = useUIStore((state) => state.selectedCountry);

  const themeMode = useUIStore((state) => state.themeMode);

  const setSearchTerm = useUIStore((state) => state.setSearchTerm);
  const [debounced] = useDebouncedValue(searchTerm, 300);

  // keep store value unchanged, but touch debounced to ensure stable typing UX
  // (HomePage reads store.searchTerm; debounce can be applied there too if desired)
  void debounced;

  const setRegion = useUIStore((state) => state.setRegion);



  const setPopulationOrder = useUIStore((state) => state.setPopulationOrder);

  const toggleTheme = useUIStore((state) => state.toggleTheme);

  const isDetailPage = location.pathname.startsWith("/country/");

  const activeCountry = isDetailPage ? selectedCountry : hoveredCountry;

  return (
    <header className="top-navbar" data-scrolled={scroll.y > 8}>
      <Group
        justify="space-between"
        align="center"
        gap="sm"
        className="top-navbar-inner"
        wrap="wrap"
      >
        <div className="navbar-brand-slot">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCountry?.code || "default-brand"}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
              className="navbar-brand"
            >
              {activeCountry ? (
                <>
                  <img
                    src={activeCountry.flag}
                    alt={`${activeCountry.name} flag`}
                    className="navbar-flag"
                  />

                  <Title order={2} size="h3" fw={700}>
                    {activeCountry.name}
                  </Title>
                </>
              ) : (
                <Title order={2} size="h3">
                  GeoScope
                </Title>
              )}
            </motion.div>
          </AnimatePresence>
        </div>


        <TextInput
          aria-label="Search countries by name"
          placeholder="Search countries..."
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.currentTarget.value)}
          className="filter-input navbar-search"
          radius="xl"
          size="sm"
          leftSection={<IconSearch size={16} />}
        />

        <Group gap="xs" align="center">
          <Select
            aria-label="Filter countries by region"
            data={regions}
            value={region}
            onChange={(value) => setRegion(value || "All")}
            className="filter-select navbar-region"
            radius="xl"
            size="sm"
          />



          <Select
            aria-label="Sort countries by population"
            data={populationOptions}
            value={populationOrder}
            onChange={(value) => setPopulationOrder(value || "none")}
            className="filter-select navbar-sort"
            radius="xl"
            size="sm"
          />

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.96 }}>
            <ActionIcon
              onClick={toggleTheme}
              variant="light"
              color="gray"
              size="lg"
              radius="xl"
              className="theme-toggle"
              aria-label="Toggle light and dark mode"
            >
              {themeMode === "light" ? (
                <IconMoonStars size={18} />
              ) : (
                <IconSun size={18} />
              )}
            </ActionIcon>
          </motion.div>
        </Group>
      </Group>
    </header>
  );
}
