import {
  Component,
  OnInit,
  ViewEncapsulation,
  ElementRef,
  Input,
  AfterViewInit,
  NgZone,
  SimpleChanges,
  OnChanges
} from "@angular/core";
import { Router, NavigationEnd } from "@angular/router";
import { MenuService } from "../menu.service";
import { AppSettings } from "../../../../app.settings";
import { Settings } from "../../../../app.settings.model";
import { Menu } from "../menu.model";

@Component({
  selector: "app-vertical-menu",
  templateUrl: "./vertical-menu.component.html",
  styleUrls: ["./vertical-menu.component.scss"],
  encapsulation: ViewEncapsulation.None,
  providers: [MenuService]
})
export class VerticalMenuComponent implements OnInit, AfterViewInit, OnChanges {
  @Input("menuItems") menuItems;
  public settings: Settings;
  constructor(
    public appSettings: AppSettings,
    private menuService: MenuService,
    private router: Router,
    private elementRef: ElementRef,
    private ngZone: NgZone
  ) {
    this.settings = this.appSettings.settings;
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        window.scrollTo(0, 0);
        let activeLink = this.menuService.getActiveLink(this.menuItems);
        this.menuService.setActiveLink(this.menuItems, activeLink);
        jQuery(".tooltip").tooltip("hide");
        if (window.innerWidth <= 768) {
          this.settings.theme.showMenu = false;
        }
      }
    });
  }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
      this.ngZone.run(() => {
        let menu_wrapper = this.elementRef.nativeElement.children[0];
        this.menuService.createMenu(this.menuItems, menu_wrapper, "vertical");
        if (this.settings.theme.menuType == "mini")
          jQuery(".menu-item-link").tooltip();
      });
    //Add '${implements OnChanges}' to the class.

  }

  ngAfterViewInit() {
    this.menuService.showActiveSubMenu(this.menuItems);
    let activeLink = this.menuService.getActiveLink(this.menuItems);
    this.menuService.setActiveLink(this.menuItems, activeLink);
  }
}
