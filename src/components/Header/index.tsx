import { DESKTOP_BREAKPOINT, useMediaquery } from "@/hooks/use-mediaquery";
import { routes } from "@/src/utils";
import { NavLink } from "react-router-dom";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { memo, useCallback, useEffect, useState } from "react";
import { DarkMode, Github, LightMode, Logo, Menu } from "@/src/assets/icons";
import { cn } from "@/lib/utils";
import { usePostHog } from "posthog-js/react";

interface NavigationItem {
  name: string;
  path: string;
  disabled?: boolean;
}

const navigationItems: NavigationItem[] = [
  { name: "Docs", path: routes.docs.installation },
  { name: "Components", path: routes.docs.components.accordion },
  { name: "Showcase", path: routes.showcase },
];
const mobileNavigationItems: { name: string; items: NavigationItem[] }[] = [
  {
    name: "",
    items: [{ name: "Showcase", path: routes.showcase }],
  },
  {
    name: "Documentation",
    items: [
      { name: "Installation", path: routes.docs.installation },
      { name: "Fonts", path: routes.docs.fonts },
      { name: "Contributing", path: routes.docs.contributing },
    ],
  },
  {
    name: "Components",
    items: [
      { name: "Accordion", path: routes.docs.components.accordion },
      { name: "Alert", path: routes.docs.components.alert },
      { name: "Alert Dialog", path: routes.docs.components.alertDialog },
      { name: "Avatar", path: routes.docs.components.avatar },
      { name: "Badge", path: routes.docs.components.badge },
      { name: "Breadcrumb", path: routes.docs.components.breadcrumb },
      { name: "Button", path: routes.docs.components.button },
      { name: "Calendar", path: routes.docs.components.calendar },
      { name: "Card", path: routes.docs.components.card },
      { name: "Carousel", path: routes.docs.components.carousel },
      { name: "Checkbox", path: routes.docs.components.checkbox },
      { name: "Collapsible", path: routes.docs.components.collapsible },
      { name: "Command", path: routes.docs.components.command },
      { name: "Context Menu", path: routes.docs.components.contextMenu },
      { name: "Dialog", path: routes.docs.components.dialog },
      { name: "Hover Card", path: routes.docs.components.hoverCard },
      { name: "Input", path: routes.docs.components.input },
      { name: "Text Area", path: routes.docs.components.textarea },
      { name: "Label", path: routes.docs.components.label },
      { name: "Popover", path: routes.docs.components.popover },
      { name: "Select", path: routes.docs.components.select },
      { name: "More coming soon...", path: "/", disabled: true },
    ],
  },
];

const fetchGithubStars = async () => {
  const response = await fetch(
    "https://api.github.com/repos/pixelact-ui/pixelact-ui"
  );
  const data = await response.json();
  return data.stargazers_count;
};

const iconsClassName = "hover:opacity-80 active:scale-90";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [githubStars, setGithubStars] = useState(0);
  const isSmallDevice = useMediaquery({ breakpoint: DESKTOP_BREAKPOINT });
  const [isDarkMode, setIsDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );
  const theme = localStorage.getItem("theme");
  const posthog = usePostHog();

  useEffect(() => {
    if (theme === "dark") {
      setIsDarkMode(true);
    } else {
      setIsDarkMode(false);
    }
  }, [theme]);

  useEffect(() => {
    const fetchData = async () => {
      const stars = await fetchGithubStars();
      setGithubStars(stars);
    };

    fetchData();
  }, [setGithubStars]);

  const LightDarkModeIcon = useCallback(() => {
    return isDarkMode ? (
      <DarkMode
        className={cn(iconsClassName, "text-foreground")}
        onClick={() => {
          setIsDarkMode(false);
          document.documentElement.classList.remove("dark");
          document.documentElement.classList.add("light");
          localStorage.setItem("theme", "light");
        }}
      />
    ) : (
      <LightMode
        className={cn(iconsClassName, "text-foreground")}
        onClick={() => {
          setIsDarkMode(true);
          document.documentElement.classList.remove("light");
          document.documentElement.classList.add("dark");
          localStorage.setItem("theme", "dark");
        }}
      />
    );
  }, [isDarkMode]);

  return (
    <header
      className={cn(
        "w-full z-50 bg-background border-b-2 border-dashed border-foreground/20",
        isSmallDevice && "fixed"
      )}
    >
      <nav className="flex gap-12 justify-between items-center h-16 max-w-[1400px] border-x-2 border-dashed border-foreground/20 mx-auto bg-background px-4 pixel-font">
        <div className="flex items-center justify-between xl:justify-normal w-full gap-12">
          <NavLink to={routes.root} className=" text-xs text-background">
            <Logo width={30} height={30} />
          </NavLink>

          {isSmallDevice ? (
            <div className="flex gap-4">
              <LightDarkModeIcon />
              <Github
                className={cn(iconsClassName, "fill-foreground")}
                onClick={() =>
                  window.open(
                    "https://github.com/pixelact-ui/pixelact-ui",
                    "__blank"
                  )
                }
              />
              <Drawer open={isOpen} onOpenChange={setIsOpen}>
                <DrawerTrigger>
                  <Menu
                    className={cn(iconsClassName)}
                    style={{ color: "var(--foreground)" }}
                  />
                </DrawerTrigger>
                <DrawerContent className="p-4">
                  <DrawerHeader className="overflow-y-auto">
                    {mobileNavigationItems.map((section) => (
                      <div key={section.name}>
                        <div className="mb-2 text-lg text-left text-foreground">
                          {section.name}
                        </div>
                        <ul className="flex flex-col space-y-3 text-left">
                          {section.items.map((subItem) => (
                            <li
                              key={subItem.path}
                              onClick={() => {
                                posthog?.capture("Clicked Documentation Link", {
                                  path: subItem.path,
                                });
                                if (!subItem.disabled) setIsOpen(false);
                              }}
                            >
                              {subItem.disabled ? (
                                <span className="opacity-40">
                                  {subItem.name}
                                </span>
                              ) : (
                                <a
                                  href={subItem.path}
                                  className="text-foreground/60"
                                >
                                  {subItem.name}
                                </a>
                              )}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </DrawerHeader>
                </DrawerContent>
              </Drawer>
            </div>
          ) : (
            <ul>
              <div className="flex items-center gap-8 text-xs">
                {navigationItems.map((item) => {
                  return (
                    <div key={item.path} className="relative">
                      {item.disabled ? (
                        <span className="text-foreground opacity-50 cursor-default">
                          {item.name}
                        </span>
                      ) : (
                        <NavLink
                          to={item.path}
                          className={cn("text-foreground")}
                        >
                          {item.name}
                        </NavLink>
                      )}
                    </div>
                  );
                })}
              </div>
            </ul>
          )}
        </div>
        {!isSmallDevice && (
          <div className="flex items-center gap-4 cursor-pointer">
            <div
              className="flex items-center gap-2 text-xs text-background"
              onClick={() =>
                window.open(
                  "https://github.com/pixelact-ui/pixelact-ui",
                  "__blank"
                )
              }
            >
              <Github className={cn(iconsClassName, "fill-foreground")} />
              <span className="text-foreground">{githubStars}</span>
            </div>
            <LightDarkModeIcon />
          </div>
        )}
      </nav>
    </header>
  );
};

export default memo(Header);
