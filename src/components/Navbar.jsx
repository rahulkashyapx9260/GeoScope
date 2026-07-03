import { Group, Title, ActionIcon, Select, TextInput, Popover, UnstyledButton, Avatar, Text, ScrollArea } from "@mantine/core";

import { useDebouncedValue, useWindowScroll } from "@mantine/hooks";
import { useState, useMemo } from "react";

import { IconMoonStars, IconSun, IconSearch } from "@tabler/icons-react";

import { AnimatePresence, motion } from "framer-motion";

import { useLocation, useNavigate } from "react-router-dom";

import { useUIStore } from "../store/useUIStore";
import { useCountries } from "../hooks/useCountries";

const regions = ["All", "Africa", "Americas", "Asia", "Europe", "Oceania"];



const populationOptions = [
  { value: "none", label: "Population" },

  { value: "highest", label: "Highest Population" },

  { value: "lowest", label: "Lowest Population" },
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

  const { data: countries = [] } = useCountries();
  const [isFocused, setIsFocused] = useState(false);
  const navigate = useNavigate();

  const suggestions = useMemo(() => {
    if (!debounced || debounced.trim() === '') return [];
    const query = debounced.toLowerCase();
    
    const matches = countries.filter(c => c.name.common.toLowerCase().includes(query) || c.cca3.toLowerCase().includes(query));
    
    matches.sort((a, b) => {
      const aName = a.name.common.toLowerCase();
      const bName = b.name.common.toLowerCase();
      
      const aStarts = aName.startsWith(query);
      const bStarts = bName.startsWith(query);
      
      if (aStarts && !bStarts) return -1;
      if (!aStarts && bStarts) return 1;
      
      return aName.localeCompare(bName);
    });

    return matches.slice(0, 6);
  }, [debounced, countries]);

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
                <img 
                  src={themeMode === 'dark' ? '/geoscope-dark.png' : '/geoscope-light.png'} 
                  alt="GeoScope Logo" 
                  style={{ height: '64px', objectFit: 'contain' }}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>


        <Popover width="target" position="bottom" shadow="md" opened={isFocused && debounced.length > 0 && suggestions.length > 0}>
          <Popover.Target>
            <TextInput
              aria-label="Search countries by name"
              placeholder="Search countries..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.currentTarget.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setTimeout(() => setIsFocused(false), 200)}
              className="filter-input navbar-search"
              radius="xl"
              size="sm"
              leftSection={<IconSearch size={16} />}
            />
          </Popover.Target>
          <Popover.Dropdown p={0} style={{ overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(16px)', background: 'rgba(255,255,255,0.05)' }} className="glass-panel">
            <ScrollArea.Autosize mah={300} type="scroll">
              {suggestions.map((item) => (
                <UnstyledButton
                  key={item.cca3}
                  w="100%"
                  p="xs"
                  onClick={() => {
                    navigate(`/country/${item.cca3}`);
                    setSearchTerm('');
                    setIsFocused(false);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    borderBottom: '1px solid rgba(150,150,150,0.1)',
                    transition: 'background 0.2s',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(150,150,150,0.1)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <Avatar src={item.flags.svg} size="sm" radius="xl" />
                  <div style={{ flex: 1 }}>
                    <Text size="sm" fw={500} style={{ color: 'inherit' }}>{item.name.common}</Text>
                    <Text size="xs" c="dimmed">{item.region}</Text>
                  </div>
                </UnstyledButton>
              ))}
            </ScrollArea.Autosize>
          </Popover.Dropdown>
        </Popover>

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
