import { booleanAttribute, computed, inject, Injectable } from '@angular/core';
import { DEPOT_SCOPED_LINKS, MENU } from '@core/layouts/sidebar/menu';
import { MenuItem } from '@core/layouts/sidebar/menu.model';
import { DepotStore } from '@features/depot/data-access/depot.store';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {
  private readonly $depot = inject(DepotStore).currentEntity;
  private readonly $depotId = computed(() => this.$depot()?.id);


  readonly $menu = computed(() => {
    const depotId = this.$depotId();
    const isDepotSelected = booleanAttribute(depotId);

    return isDepotSelected ? this.buildDepotMenu(<string>depotId) : this.buildDefaultMenu();
  });

  private buildDepotMenu(depotId: string) {
    return MENU.map((item) => {
      const isDepotScoped = this.routeInDepotScope(item);

      if (isDepotScoped) {
        return {
          ...item,
          link: `depots/${depotId}/${item.link}`
        };
      }

      return item;
    });
  }

  private buildDefaultMenu() {
    return MENU.filter((item) => !this.routeInDepotScope(item));
  }

  private routeInDepotScope(menuItem: MenuItem) {
    return menuItem.link && DEPOT_SCOPED_LINKS.has(menuItem.link);
  }
}
