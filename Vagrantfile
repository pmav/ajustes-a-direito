# -*- mode: ruby -*-
# vi: set ft=ruby :

Vagrant.configure(2) do |config|

  config.vm.box = "phusion/ubuntu-14.04-amd64"
  config.vm.network :private_network, ip: "192.168.99.99"
  config.vm.synced_folder "./", "/vagrant"

  config.vm.provider "virtualbox" do |vb|
    vb.name = "org.factor45.AjustesDireitos"
    vb.memory = "512"
  end

  config.vm.provision "shell", inline: <<-SHELL
    apt-get update
    apt-get install -y nodejs
    apt-get install -y npm
    apt-get install -y redis-tools
    echo "cd /vagrant" >> /home/vagrant/.bashrc
    echo "export BEANSTALKD_HOST=127.0.0.1" >> /home/vagrant/.bashrc
    echo "export REDIS_HOST=127.0.0.1" >> /home/vagrant/.bashrc
  SHELL

  config.vm.provision "docker" do |d|
    d.run "redis",
      auto_assign_name: false,
      args: "--name redis01 --detach=true --publish=6379:6379 --restart=always"

    d.run "m0ikz/beanstalkd",
      auto_assign_name: false,
      args: "--name beanstalkd01 --detach=true --publish=11300:11300 --restart=always"

    d.run "nginx",
      auto_assign_name: false,
      args: "--name nginx01 --detach=true --publish=80:80 --restart=always -v /vagrant/docs:/usr/share/nginx/html:ro"
  end

  config.vm.provision "shell",
    run: "always",
    inline: "docker restart nginx01"

end
