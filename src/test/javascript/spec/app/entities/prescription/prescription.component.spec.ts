/* tslint:disable max-line-length */
import { shallowMount, createLocalVue, Wrapper } from '@vue/test-utils';
import sinon, { SinonStubbedInstance } from 'sinon';

import AlertService from '@/shared/alert/alert.service';
import * as config from '@/shared/config/config';
import PRESCRIPTIONComponent from '@/entities/prescription/prescription.vue';
import PRESCRIPTIONClass from '@/entities/prescription/prescription.component';
import PRESCRIPTIONService from '@/entities/prescription/prescription.service';

const localVue = createLocalVue();

config.initVueApp(localVue);
const store = config.initVueXStore(localVue);
localVue.component('font-awesome-icon', {});
localVue.component('b-alert', {});
localVue.component('b-badge', {});
localVue.directive('b-modal', {});
localVue.component('b-button', {});
localVue.component('router-link', {});

const bModalStub = {
  render: () => {},
  methods: {
    hide: () => {},
    show: () => {},
  },
};

describe('Component Tests', () => {
  describe('PRESCRIPTION Management Component', () => {
    let wrapper: Wrapper<PRESCRIPTIONClass>;
    let comp: PRESCRIPTIONClass;
    let pRESCRIPTIONServiceStub: SinonStubbedInstance<PRESCRIPTIONService>;

    beforeEach(() => {
      pRESCRIPTIONServiceStub = sinon.createStubInstance<PRESCRIPTIONService>(PRESCRIPTIONService);
      pRESCRIPTIONServiceStub.retrieve.resolves({ headers: {} });

      wrapper = shallowMount<PRESCRIPTIONClass>(PRESCRIPTIONComponent, {
        store,
        localVue,
        stubs: { bModal: bModalStub as any },
        provide: {
          alertService: () => new AlertService(store),
          pRESCRIPTIONService: () => pRESCRIPTIONServiceStub,
        },
      });
      comp = wrapper.vm;
    });

    it('Should call load all on init', async () => {
      // GIVEN
      pRESCRIPTIONServiceStub.retrieve.resolves({ headers: {}, data: [{ id: 123 }] });

      // WHEN
      comp.retrieveAllPRESCRIPTIONs();
      await comp.$nextTick();

      // THEN
      expect(pRESCRIPTIONServiceStub.retrieve.called).toBeTruthy();
      expect(comp.pRESCRIPTIONS[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });
    it('Should call delete service on confirmDelete', async () => {
      // GIVEN
      pRESCRIPTIONServiceStub.delete.resolves({});

      // WHEN
      comp.prepareRemove({ id: 123 });
      comp.removePRESCRIPTION();
      await comp.$nextTick();

      // THEN
      expect(pRESCRIPTIONServiceStub.delete.called).toBeTruthy();
      expect(pRESCRIPTIONServiceStub.retrieve.callCount).toEqual(2);
    });
  });
});
